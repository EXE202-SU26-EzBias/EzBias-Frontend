import type { ChatMessage } from '../../types/chat';
import { formatTimeAgo } from '../../utils/formatters';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

const MessageBubble = ({ message, isMine }: MessageBubbleProps) => (
  <div className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
    {!isMine && (
      <div className="h-7 w-7 shrink-0 rounded-full bg-[#ad93e6] grid place-items-center text-[10px] font-bold text-white">
        {message.senderName.slice(0, 2).toUpperCase()}
      </div>
    )}
    <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
      <div
        className={[
          'rounded-2xl px-3 py-2 text-[13px] leading-relaxed break-words',
          isMine
            ? 'bg-[#ad93e6] text-white rounded-tr-sm'
            : 'bg-[#f4f3f7] text-[#121212] rounded-tl-sm',
        ].join(' ')}
      >
        {message.content}
      </div>
      <span className="text-[10px] text-[#b3b3b3]">{formatTimeAgo(message.sentAt)}</span>
    </div>
  </div>
);

export default MessageBubble;
