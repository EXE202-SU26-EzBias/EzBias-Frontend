import { useEffect, useState } from 'react';
import { useConversations } from '../../services/chat.service';
import { formatTimeAgo } from '../../utils/formatters';
import type { Conversation } from '../../types/chat';

interface ConversationListProps {
  activeId: number | null;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList = ({ activeId, onSelect }: ConversationListProps) => {
  const { data: conversations = [], isLoading } = useConversations();
  const [, setTick] = useState(0);

  // Update time display every minute
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[13px] text-[#b3b3b3]">No conversations yet.</p>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          type="button"
          onClick={() => onSelect(conv)}
          className={[
            'flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#fafafa] border-b border-[rgba(230,230,230,0.5)]',
            activeId === conv.id ? 'bg-[rgba(173,147,230,0.08)]' : '',
          ].join(' ')}
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-[#ad93e6] grid place-items-center text-[11px] font-bold text-white">
            {conv.otherParticipantName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-semibold text-[#121212] truncate">
                {conv.otherParticipantName}
              </span>
              {conv.lastMessageAt && (
                <span className="text-[11px] text-[#b3b3b3] shrink-0">
                  {formatTimeAgo(conv.lastMessageAt)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-[12px] text-[#737373] truncate">
                {conv.lastMessagePreview ?? 'No messages yet'}
              </p>
              {conv.unreadCount > 0 && (
                <span className="shrink-0 h-5 min-w-5 rounded-full bg-[#ad93e6] text-white text-[10px] font-bold grid place-items-center px-1">
                  {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConversationList;
