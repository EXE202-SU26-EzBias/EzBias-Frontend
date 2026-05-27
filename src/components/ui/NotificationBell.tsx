import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMarkRead,
  useMarkReadAll,
  useNotifications,
} from '../../services/notification.service';
import { getNotificationRoute } from '../../utils/notificationNav';
import { formatTimeAgo } from '../../utils/formatters';

const BellIcon = ({ hasUnread }: { hasUnread: boolean }) => (
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
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markReadAll } = useMarkReadAll();

  const unread = notifications.filter((n) => !n.isRead);
  const unreadCount = unread.length;

  // Close on outside click
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

  const handleClick = (notif: typeof notifications[number]) => {
    if (!notif.isRead) markRead(notif.id);
    const route = getNotificationRoute(notif);
    if (route) navigate(route);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-[37px] w-[37px] items-center justify-center"
      >
        <BellIcon hasUnread={unreadCount > 0} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ad93e6] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-[200] mt-2 w-[340px] overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white shadow-xl"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e6e6e6] px-4 py-3">
            <span className="text-[14px] font-bold text-[#121212]">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markReadAll()}
                className="text-[12px] font-medium text-[#ad93e6] hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px] text-[#b3b3b3]">No notifications yet</p>
            ) : (
              notifications.slice(0, 30).map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  onClick={() => handleClick(notif)}
                  className={[
                    'flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[#fafafa]',
                    !notif.isRead ? 'bg-[rgba(173,147,230,0.06)]' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[13px] font-semibold leading-snug ${!notif.isRead ? 'text-[#121212]' : 'text-[#737373]'}`}>
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ad93e6]" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-[12px] leading-relaxed text-[#737373] line-clamp-2">{notif.body}</span>
                  <span className="mt-0.5 text-[11px] text-[#b3b3b3]">{formatTimeAgo(notif.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
