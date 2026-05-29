import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useConversations } from '../../services/chat.service';
import { formatTimeAgo } from '../../utils/formatters';
import type { Conversation } from '../../types/chat';
import ChatPanel from './ChatPanel';

const ChatIcon = ({ hasUnread }: { hasUnread: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={hasUnread ? 'text-[#ad93e6]' : 'text-[#737373]'}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function ChatInbox() {
  const [open, setOpen] = useState(false);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: conversations = [] } = useConversations();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (conv: Conversation) => {
    setActiveConv(conv);
    setOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          aria-label={`Messages${totalUnread > 0 ? `, ${totalUnread} unread` : ''}`}
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-[37px] w-[37px] items-center justify-center"
        >
          <ChatIcon hasUnread={totalUnread > 0} />
          {totalUnread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ad93e6] px-1 text-[10px] font-bold leading-none text-white">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>

        {open && (
          <div
            ref={panelRef}
            className="absolute right-0 top-full z-[200] mt-2 w-[320px] overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-xl"
            role="dialog"
            aria-label="Messages"
          >
            <div className="flex items-center justify-between border-b border-[#e6e6e6] px-4 py-3">
              <span className="text-[14px] font-bold text-[#121212]">Messages</span>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-4 py-8 text-center text-[13px] text-[#b3b3b3]">No conversations yet</p>
              ) : (
                conversations.slice(0, 20).map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelect(conv)}
                    className={[
                      'flex w-full items-start gap-3 border-b border-[rgba(230,230,230,0.5)] px-4 py-3 text-left transition-colors hover:bg-[#fafafa]',
                      conv.unreadCount > 0 ? 'bg-[rgba(173,147,230,0.06)]' : '',
                    ].join(' ')}
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ad93e6] text-[10px] font-bold text-white">
                      {conv.otherParticipantName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`truncate text-[13px] ${conv.unreadCount > 0 ? 'font-bold text-[#121212]' : 'font-semibold text-[#121212]'}`}>
                          {conv.otherParticipantName}
                        </span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {conv.lastMessageAt && (
                            <span className="text-[11px] text-[#b3b3b3]">
                              {formatTimeAgo(conv.lastMessageAt)}
                            </span>
                          )}
                          {conv.unreadCount > 0 && (
                            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#ad93e6] px-1 text-[10px] font-bold text-white">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-[#737373]">
                        {conv.lastMessagePreview ?? 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {activeConv && createPortal(
        <ChatPanel
          conversation={activeConv}
          onClose={() => setActiveConv(null)}
        />,
        document.body,
      )}
    </>
  );
}
