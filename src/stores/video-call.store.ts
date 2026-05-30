import { create } from 'zustand';
import type {
  AnswerSignalPayload,
  CallSession,
  IceCandidateSignalPayload,
  OfferSignalPayload,
  WebRtcSignal,
} from '../types/videoCall';

type CallMode = 'idle' | 'incoming' | 'outgoing' | 'active';

interface VideoCallState {
  mode: CallMode;
  incomingCall: CallSession | null;
  activeCall: CallSession | null;
  peerName: string;
  pendingOffer: WebRtcSignal<OfferSignalPayload> | null;
  pendingAnswer: WebRtcSignal<AnswerSignalPayload> | null;
  pendingIceCandidates: WebRtcSignal<IceCandidateSignalPayload>[];
  setIncomingCall: (call: CallSession) => void;
  startOutgoingCall: (call: CallSession, peerName: string) => void;
  activateCall: (call: CallSession, peerName?: string) => void;
  updateCall: (call: CallSession) => void;
  clearCall: () => void;
  setPendingOffer: (signal: WebRtcSignal<OfferSignalPayload>) => void;
  clearPendingOffer: () => void;
  setPendingAnswer: (signal: WebRtcSignal<AnswerSignalPayload>) => void;
  clearPendingAnswer: () => void;
  addIceCandidate: (signal: WebRtcSignal<IceCandidateSignalPayload>) => void;
  clearIceCandidates: () => void;
}

export const useVideoCallStore = create<VideoCallState>((set) => ({
  mode: 'idle',
  incomingCall: null,
  activeCall: null,
  peerName: '',
  pendingOffer: null,
  pendingAnswer: null,
  pendingIceCandidates: [],
  setIncomingCall: (call) => set({ incomingCall: call, mode: 'incoming' }),
  startOutgoingCall: (call, peerName) => set({ activeCall: call, peerName, incomingCall: null, mode: 'outgoing' }),
  activateCall: (call, peerName) => set((state) => ({
    activeCall: call,
    peerName: peerName ?? state.peerName,
    incomingCall: null,
    mode: 'active',
  })),
  updateCall: (call) => set((state) => ({
    activeCall: state.activeCall?.id === call.id ? call : state.activeCall,
    incomingCall: state.incomingCall?.id === call.id ? call : state.incomingCall,
    mode: call.status === 'Accepted' && state.activeCall?.id === call.id ? 'active' : state.mode,
  })),
  clearCall: () => set({
    mode: 'idle',
    incomingCall: null,
    activeCall: null,
    peerName: '',
    pendingOffer: null,
    pendingAnswer: null,
    pendingIceCandidates: [],
  }),
  setPendingOffer: (signal) => set({ pendingOffer: signal }),
  clearPendingOffer: () => set({ pendingOffer: null }),
  setPendingAnswer: (signal) => set({ pendingAnswer: signal }),
  clearPendingAnswer: () => set({ pendingAnswer: null }),
  addIceCandidate: (signal) => set((state) => ({ pendingIceCandidates: [...state.pendingIceCandidates, signal] })),
  clearIceCandidates: () => set({ pendingIceCandidates: [] }),
}));
