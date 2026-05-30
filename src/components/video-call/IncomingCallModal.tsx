import type { AxiosError } from 'axios';
import { useConversations } from '../../services/chat.service';
import { useAcceptCall, useRejectCall } from '../../services/video-call.service';
import { useUiStore } from '../../stores/ui.store';
import { useVideoCallStore } from '../../stores/video-call.store';

const IncomingCallModal = () => {
  const incomingCall = useVideoCallStore((s) => s.incomingCall);
  const activateCall = useVideoCallStore((s) => s.activateCall);
  const clearCall = useVideoCallStore((s) => s.clearCall);
  const showToast = useUiStore((s) => s.showToast);
  const { data: conversations = [] } = useConversations();
  const { mutate: acceptCall, isPending: accepting } = useAcceptCall();
  const { mutate: rejectCall, isPending: rejecting } = useRejectCall();

  if (!incomingCall) return null;

  const conversation = conversations.find((item) => item.id === incomingCall.conversationId);
  const peerName = conversation?.otherParticipantName ?? `User #${incomingCall.callerId}`;

  const handleAccept = () => {
    acceptCall(incomingCall.id, {
      onSuccess: (call) => activateCall(call, peerName),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Could not accept video call.';
        showToast(message, 'error');
      },
    });
  };

  const handleReject = () => {
    rejectCall(incomingCall.id, {
      onSettled: () => clearCall(),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Could not reject video call.';
        showToast(message, 'error');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[360px] rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ad93e6] text-[14px] font-bold text-white">
            {peerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[#121212]">{peerName}</p>
            <p className="text-[13px] text-[#737373]">Incoming video call</p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            disabled={rejecting || accepting}
            onClick={handleReject}
            className="h-10 flex-1 rounded-full border border-[#ef4444] text-[13px] font-semibold text-[#ef4444] transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Decline
          </button>
          <button
            type="button"
            disabled={rejecting || accepting}
            onClick={handleAccept}
            className="h-10 flex-1 rounded-full bg-[#16a34a] text-[13px] font-semibold text-white transition-colors hover:bg-[#15803d] disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
