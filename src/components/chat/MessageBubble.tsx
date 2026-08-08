import type { ChatMessage } from '../../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  showStatus: boolean;
}

// Helper to detect if content is an image URL
const isImageUrl = (content: string): boolean => {
  const imagePattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
  return imagePattern.test(content) || content.includes('cloudinary.com') || content.includes('res.cloudinary.com');
};

const MessageBubble = ({ message, isMine, showStatus }: MessageBubbleProps) => {
  const isImage = isImageUrl(message.content);

  return (
    <div className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isMine && (
        <div className="h-7 w-7 shrink-0 rounded-full bg-[#ad93e6] grid place-items-center text-[10px] font-bold text-white">
          {message.senderName.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
        <div
          className={[
            'rounded-2xl overflow-hidden',
            isMine
              ? 'bg-[#ad93e6] text-white rounded-tr-sm'
              : 'bg-[#f4f3f7] text-[#121212] rounded-tl-sm',
            isImage ? '' : 'px-3 py-2',
          ].join(' ')}
        >
          {isImage ? (
            <img
              src={message.content}
              alt="Shared image"
              className="max-w-full max-h-80 object-contain cursor-pointer"
              onClick={() => window.open(message.content, '_blank')}
              loading="lazy"
            />
          ) : (
            <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>
        {isMine && showStatus && (
          <span className="text-[10px] text-[#b3b3b3]">
            {message.isRead ? 'Đã xem' : 'Đã gửi'}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
