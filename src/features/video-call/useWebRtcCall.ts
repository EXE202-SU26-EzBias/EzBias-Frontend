import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { useVideoCallStore } from '../../stores/video-call.store';
import type { CallSession } from '../../types/videoCall';
import { invokeCallHub } from './callHubConnection';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' },
];

function getIceServers(): RTCIceServer[] {
  const raw = import.meta.env.VITE_WEBRTC_ICE_SERVERS;
  if (!raw) return ICE_SERVERS;
  try {
    const parsed = JSON.parse(raw) as RTCIceServer[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : ICE_SERVERS;
  } catch (err) {
    console.warn('[WebRTC] invalid VITE_WEBRTC_ICE_SERVERS value:', err);
    return ICE_SERVERS;
  }
}

interface VideoRefs {
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
}

export function useWebRtcCall(call: CallSession | null, refs: VideoRefs) {
  const { localVideoRef, remoteVideoRef } = refs;
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const showToast = useUiStore((s) => s.showToast);
  const pendingOffer = useVideoCallStore((s) => s.pendingOffer);
  const pendingAnswer = useVideoCallStore((s) => s.pendingAnswer);
  const pendingIceCandidates = useVideoCallStore((s) => s.pendingIceCandidates);
  const clearPendingOffer = useVideoCallStore((s) => s.clearPendingOffer);
  const clearPendingAnswer = useVideoCallStore((s) => s.clearPendingAnswer);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [statusText, setStatusText] = useState('Connecting...');
  const [peerReady, setPeerReady] = useState(false);
  const [hasRemoteMedia, setHasRemoteMedia] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const offerSentRef = useRef(false);
  const answerSentRef = useRef(false);
  const answerAppliedRef = useRef(false);
  const processedIceRef = useRef(0);
  const queuedIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const remoteUserId = useMemo(() => {
    if (!call || !currentUserId) return null;
    return call.callerId === currentUserId ? call.calleeId : call.callerId;
  }, [call, currentUserId]);

  const isCaller = !!call && !!currentUserId && call.callerId === currentUserId;

  // ── Setup: media + peer connection ──────────────────────────────────────────
  useEffect(() => {
    if (!call || !remoteUserId) return;

    let cancelled = false;
    offerSentRef.current = false;
    answerSentRef.current = false;
    answerAppliedRef.current = false;
    processedIceRef.current = 0;
    queuedIceCandidatesRef.current = [];
    setPeerReady(false);
    setHasRemoteMedia(false);
    setStatusText(call.status === 'Accepted' ? 'Starting video...' : 'Waiting for answer...');

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const remote = new MediaStream();
        const pc = new RTCPeerConnection({ iceServers: getIceServers() });
        pcRef.current = pc;
        localStreamRef.current = stream;
        remoteStreamRef.current = remote;

        // Attach local preview directly to the element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        // Pre-attach remote element to the (empty) remote stream
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remote;
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          // Add any new tracks to the persistent remote stream
          const incoming = event.streams[0]?.getTracks() ?? [event.track];
          incoming.forEach((track) => {
            if (!remote.getTracks().some((t) => t.id === track.id)) {
              remote.addTrack(track);
            }
          });

          // Attach directly to the element — do NOT rely on React state re-render
          if (remoteVideoRef.current) {
            if (remoteVideoRef.current.srcObject !== remote) {
              remoteVideoRef.current.srcObject = remote;
            }
            remoteVideoRef.current.volume = 1;
            remoteVideoRef.current.play().catch((err) =>
              console.warn('[WebRTC] remote playback blocked:', err));
          }

          setHasRemoteMedia(remote.getTracks().length > 0);
          setStatusText('Connected');
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            invokeCallHub('SendIceCandidate', call.id, remoteUserId, event.candidate.toJSON())
              .catch((err) => console.warn('[CallHub] failed to send ICE candidate:', err));
          }
        };

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') setStatusText('Connected');
          if (pc.connectionState === 'failed') setStatusText('Connection failed');
          if (pc.connectionState === 'disconnected') setStatusText('Disconnected');
        };

        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'checking') setStatusText('Connecting media...');
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') setStatusText('Connected');
          if (pc.iceConnectionState === 'failed') {
            setStatusText('Media connection failed');
            // Attempt ICE restart for the caller
            if (isCaller) pc.restartIce();
          }
        };

        setPeerReady(true);
      } catch (err) {
        console.warn('[WebRTC] media setup failed:', err);
        setStatusText('Camera or microphone unavailable');
        showToast('Please allow camera and microphone access to start video call.', 'error');
      }
    };

    setup();

    return () => {
      cancelled = true;
      pcRef.current?.close();
      pcRef.current = null;
      queuedIceCandidatesRef.current = [];
      setPeerReady(false);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      remoteStreamRef.current = null;
      setHasRemoteMedia(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call?.id, remoteUserId]);

  // ── Caller: create & send offer once peer is ready ───────────────────────────
  useEffect(() => {
    if (
      !call || !remoteUserId || !isCaller || !peerReady || offerSentRef.current ||
      call.status === 'Rejected' || call.status === 'Ended' ||
      call.status === 'Missed' || call.status === 'Failed'
    ) return;
    const pc = pcRef.current;
    if (!pc) return;

    offerSentRef.current = true;
    (async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await invokeCallHub('SendOffer', call.id, remoteUserId, offer);
        setStatusText(call.status === 'Ringing' ? 'Ringing...' : 'Calling...');
      } catch (err) {
        offerSentRef.current = false;
        console.warn('[WebRTC] failed to send offer:', err);
        showToast('Could not start video call.', 'error');
      }
    })();
  }, [call, isCaller, peerReady, remoteUserId, showToast]);

  // ── Callee: answer incoming offer ────────────────────────────────────────────
  useEffect(() => {
    if (!call || isCaller || !peerReady || answerSentRef.current) return;
    if (!pendingOffer || pendingOffer.callId !== call.id) return;
    const pc = pcRef.current;
    if (!pc) return;

    answerSentRef.current = true;
    (async () => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer.payload.offer));
        await flushQueuedIceCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await invokeCallHub('SendAnswer', call.id, pendingOffer.fromUserId, answer);
        clearPendingOffer();
        setStatusText('Connecting...');
      } catch (err) {
        answerSentRef.current = false;
        console.warn('[WebRTC] failed to answer offer:', err);
        showToast('Could not answer video call.', 'error');
      }
    })();
  }, [call, clearPendingOffer, isCaller, peerReady, pendingOffer, showToast]);

  // ── Caller: apply answer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!call || !isCaller || !peerReady || answerAppliedRef.current) return;
    if (!pendingAnswer || pendingAnswer.callId !== call.id) return;
    const pc = pcRef.current;
    if (!pc) return;

    answerAppliedRef.current = true;
    pc.setRemoteDescription(new RTCSessionDescription(pendingAnswer.payload.answer))
      .then(() => {
        void flushQueuedIceCandidates(pc);
        clearPendingAnswer();
        setStatusText('Connecting...');
      })
      .catch((err) => {
        answerAppliedRef.current = false;
        console.warn('[WebRTC] failed to apply answer:', err);
        showToast('Could not connect video call.', 'error');
      });
  }, [call, clearPendingAnswer, isCaller, peerReady, pendingAnswer, showToast]);

  // ── Both: process incoming ICE candidates (append-only, no mid-call clearing) ─
  useEffect(() => {
    if (!call || !peerReady) return;
    if (pendingIceCandidates.length <= processedIceRef.current) return;
    const pc = pcRef.current;
    if (!pc) return;

    const next = pendingIceCandidates
      .slice(processedIceRef.current)
      .filter((signal) => signal.callId === call.id);
    processedIceRef.current = pendingIceCandidates.length;

    next.forEach((signal) => addRemoteIceCandidate(pc, signal.payload.candidate));
  }, [call, peerReady, pendingIceCandidates]);

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !micEnabled; });
    setMicEnabled((value) => !value);
  };

  const toggleCamera = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = !cameraEnabled; });
    setCameraEnabled((value) => !value);
  };

  return { hasRemoteMedia, micEnabled, cameraEnabled, statusText, toggleMic, toggleCamera };

  async function flushQueuedIceCandidates(pc: RTCPeerConnection) {
    if (!pc.remoteDescription || queuedIceCandidatesRef.current.length === 0) return;
    const candidates = queuedIceCandidatesRef.current;
    queuedIceCandidatesRef.current = [];
    for (const candidate of candidates) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
        .catch((err) => console.warn('[WebRTC] failed to add queued ICE candidate:', err));
    }
  }

  function addRemoteIceCandidate(pc: RTCPeerConnection, candidate: RTCIceCandidateInit) {
    if (!pc.remoteDescription) {
      queuedIceCandidatesRef.current.push(candidate);
      return;
    }
    pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch((err) => console.warn('[WebRTC] failed to add ICE candidate:', err));
  }
}
