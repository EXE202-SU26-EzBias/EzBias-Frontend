export type CallSessionStatus = 'Ringing' | 'Accepted' | 'Rejected' | 'Ended' | 'Missed' | 'Failed';

export interface CallSession {
  id: number;
  conversationId: number;
  callerId: number;
  calleeId: number;
  status: CallSessionStatus;
  createdAt: string;
  answeredAt: string | null;
  endedAt: string | null;
}

export interface WebRtcSignal<T> {
  callId: number;
  fromUserId: number;
  payload: T;
}

export interface OfferSignalPayload {
  callId: number;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerSignalPayload {
  callId: number;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateSignalPayload {
  callId: number;
  candidate: RTCIceCandidateInit;
}
