import { useEffect } from 'react';
import MessageThread from './MessageThread';
import StartVideoCallButton from '../video-call/StartVideoCallButton';
import type { Conversation } from '../../types/chat';

interface ChatPanelProps {
  conversation: Conversation;
  onClose: () => void;
}

const ChatPanel = ({ conversation, onClose }: ChatPanelProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[250] w-[360px] h-[480px] rounded-2xl bg-white shadow-2xl border border-[#e6e6e6] flex flex-col overflow-hidden"
      role="dialog"
      aria-label={`Chat with ${conversation.otherParticipantName}`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6e6e6] bg-[#fafafa] shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-[#ad93e6] grid place-items-center text-[10px] font-bold text-white">
            {conversation.otherParticipantName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[13px] font-semibold text-[#121212]">
            {conversation.otherParticipantName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StartVideoCallButton conversation={conversation} compact />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="h-7 w-7 flex items-center justify-center rounded-lg text-[#737373] hover:bg-[#f0edf7] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thread — hideHeader because panel already shows the name */}
      <div className="flex-1 overflow-hidden">
        <MessageThread
          conversationId={conversation.id}
          otherParticipantName={conversation.otherParticipantName}
          otherParticipantId={conversation.otherParticipantId}
          hideHeader
        />
      </div>
    </div>
  );
};

export default ChatPanel;
