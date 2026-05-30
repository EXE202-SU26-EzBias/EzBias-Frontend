import { useEffect, useRef, useState } from 'react';
import type { AxiosError } from 'axios';
import { useMessages, useMarkRead, useSendMessage } from '../../services/chat.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import MessageBubble from './MessageBubble';
import StartVideoCallButton from '../video-call/StartVideoCallButton';

interface MessageThreadProps {
  conversationId: number;
  otherParticipantName: string;
  otherParticipantId?: number;
  hideHeader?: boolean;
}

const MessageThread = ({ conversationId, otherParticipantName, otherParticipantId, hideHeader = false }: MessageThreadProps) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const showToast = useUiStore((s) => s.showToast);

  const { data, isLoading, fetchNextPage, hasNextPage } = useMessages(conversationId);
  const { mutate: markRead } = useMarkRead(conversationId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage(conversationId);

  // Flatten pages — pages are in reverse order (newest page first), messages within each page are ascending
  const allMessages = data?.pages.flatMap((p) => p.messages) ?? [];

  // Mark as read when opening
  useEffect(() => {
    if (conversationId > 0) markRead();
  }, [conversationId, markRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    sendMessage(trimmed, {
      onSuccess: () => setInput(''),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Failed to send message.';
        showToast(message, 'error');
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header — hidden when used inside ChatPanel */}
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-[#e6e6e6] px-4 py-3 shrink-0">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#ad93e6] grid place-items-center text-[11px] font-bold text-white">
              {otherParticipantName.slice(0, 2).toUpperCase()}
            </div>
            <span className="truncate text-[14px] font-semibold text-[#121212]">{otherParticipantName}</span>
          </div>
          {otherParticipantId !== undefined && (
            <StartVideoCallButton conversation={{ id: conversationId, otherParticipantName }} compact />
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="self-center text-[12px] text-[#ad93e6] hover:underline"
          >
            Load earlier messages
          </button>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : allMessages.length === 0 ? (
          <p className="text-center text-[13px] text-[#b3b3b3] py-8">
            No messages yet. Say hello!
          </p>
        ) : (
          allMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.senderId === currentUserId}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#e6e6e6] px-4 py-3 shrink-0 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-[#e6e6e6] px-3 py-2 text-[13px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.2)] max-h-28 overflow-y-auto"
        />
        <button
          type="button"
          disabled={!input.trim() || sending}
          onClick={handleSend}
          className="h-9 w-9 shrink-0 rounded-full bg-[#ad93e6] text-white flex items-center justify-center transition hover:bg-[#9d7ed9] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageThread;
