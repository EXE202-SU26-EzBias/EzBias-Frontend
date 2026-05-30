import type { AxiosError } from 'axios';
import { useStartCall } from '../../services/video-call.service';
import { useUiStore } from '../../stores/ui.store';
import { useVideoCallStore } from '../../stores/video-call.store';
import type { Conversation } from '../../types/chat';

interface StartVideoCallButtonProps {
  conversation: Pick<Conversation, 'id' | 'otherParticipantName'>;
  compact?: boolean;
}

const StartVideoCallButton = ({ conversation, compact = false }: StartVideoCallButtonProps) => {
  const showToast = useUiStore((s) => s.showToast);
  const startOutgoingCall = useVideoCallStore((s) => s.startOutgoingCall);
  const callMode = useVideoCallStore((s) => s.mode);
  const { mutate: startCall, isPending } = useStartCall();

  const disabled = isPending || callMode !== 'idle';

  const handleStartCall = () => {
    startCall(conversation.id, {
      onSuccess: (call) => startOutgoingCall(call, conversation.otherParticipantName),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Could not start video call.';
        showToast(message, 'error');
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleStartCall}
      disabled={disabled}
      aria-label={`Start video call with ${conversation.otherParticipantName}`}
      className={[
        'inline-flex items-center justify-center rounded-lg text-[#737373] transition-colors hover:bg-[#f0edf7] hover:text-[#7c3aed] disabled:opacity-50',
        compact ? 'h-7 w-7' : 'h-8 w-8',
      ].join(' ')}
    >
      <svg width={compact ? 14 : 16} height={compact ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3.5l6 4v-11l-6 4Z" />
      </svg>
    </button>
  );
};

export default StartVideoCallButton;
