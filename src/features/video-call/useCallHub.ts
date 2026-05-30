import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { useVideoCallStore } from '../../stores/video-call.store';
import type {
  AnswerSignalPayload,
  CallSession,
  IceCandidateSignalPayload,
  OfferSignalPayload,
  WebRtcSignal,
} from '../../types/videoCall';
import { setCallHubConnection } from './callHubConnection';

const HUB_URL = `${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')}/hubs/calls`;

export function useCallHub() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useUiStore((s) => s.showToast);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setCallHubConnection(null);
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => accessToken ?? '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;
    setCallHubConnection(connection);

    connection.on('IncomingCall', (call: CallSession) => {
      useVideoCallStore.getState().setIncomingCall(call);
    });

    connection.on('CallAccepted', (call: CallSession) => {
      useVideoCallStore.getState().updateCall(call);
    });

    connection.on('CallRejected', () => {
      useVideoCallStore.getState().clearCall();
      showToast('Video call declined.', 'error');
    });

    connection.on('CallEnded', () => {
      useVideoCallStore.getState().clearCall();
      showToast('Video call ended.', 'success');
    });

    connection.on('WebRtcOffer', (signal: WebRtcSignal<OfferSignalPayload>) => {
      useVideoCallStore.getState().setPendingOffer(signal);
    });

    connection.on('WebRtcAnswer', (signal: WebRtcSignal<AnswerSignalPayload>) => {
      useVideoCallStore.getState().setPendingAnswer(signal);
    });

    connection.on('IceCandidate', (signal: WebRtcSignal<IceCandidateSignalPayload>) => {
      useVideoCallStore.getState().addIceCandidate(signal);
    });

    connection.start().catch((err) => console.warn('[CallHub] connection failed:', err));

    return () => {
      setCallHubConnection(null);
      connection.stop();
    };
  }, [accessToken, isAuthenticated, showToast]);
}
