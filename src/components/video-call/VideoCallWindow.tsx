import type { AxiosError } from 'axios';
import { useRef } from 'react';
import { useWebRtcCall } from '../../features/video-call/useWebRtcCall';
import { useEndCall } from '../../services/video-call.service';
import { useUiStore } from '../../stores/ui.store';
import { useVideoCallStore } from '../../stores/video-call.store';

const VideoCallWindow = () => {
  const activeCall = useVideoCallStore((s) => s.activeCall);
  const mode = useVideoCallStore((s) => s.mode);
  const peerName = useVideoCallStore((s) => s.peerName);
  const clearCall = useVideoCallStore((s) => s.clearCall);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: endCall, isPending: ending } = useEndCall();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { hasRemoteMedia, micEnabled, cameraEnabled, statusText, toggleMic, toggleCamera } =
    useWebRtcCall(activeCall, { localVideoRef, remoteVideoRef });

  if (!activeCall) return null;

  const handleEndCall = () => {
    endCall(activeCall.id, {
      onSettled: () => clearCall(),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Could not end video call.';
        showToast(message, 'error');
      },
    });
  };

  const displayStatus = activeCall.status === 'Ringing' && mode === 'outgoing'
    ? 'Ringing...'
    : statusText;

  return (
    <div className="fixed inset-0 z-[480] bg-[#111111] text-white">
      <div className="relative flex h-full w-full flex-col">
        <div className="relative min-h-0 flex-1 bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
          {!hasRemoteMedia && (
            <div className="absolute inset-0 grid place-items-center bg-[#181818]">
              <div className="text-center">
                <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-[#ad93e6] text-[22px] font-bold">
                  {peerName.slice(0, 2).toUpperCase() || 'VC'}
                </div>
                <p className="text-[15px] font-semibold">{peerName || 'Video call'}</p>
                <p className="mt-1 text-[13px] text-white/70">{displayStatus}</p>
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4 h-[150px] w-[112px] overflow-hidden rounded-xl border border-white/20 bg-[#242424] shadow-xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {!cameraEnabled && (
              <div className="absolute inset-0 grid place-items-center bg-[#242424] text-[11px] text-white/70">
                Camera off
              </div>
            )}
          </div>
        </div>

        <div className="flex h-[86px] shrink-0 items-center justify-center gap-4 border-t border-white/10 bg-[#181818] px-4">
          <button
            type="button"
            onClick={toggleMic}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${micEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-[#ef4444]'}`}
            aria-label={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${cameraEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-[#ef4444]'}`}
            aria-label={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3.5l6 4v-11l-6 4Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleEndCall}
            disabled={ending}
            className="grid h-12 w-12 place-items-center rounded-full bg-[#ef4444] transition-colors hover:bg-[#dc2626] disabled:opacity-50"
            aria-label="End call"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.61a2 2 0 0 1-.45 2.11L8.09 9.91" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallWindow;
