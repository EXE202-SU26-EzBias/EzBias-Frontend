import { useEffect, useRef, useState } from 'react';
import type { AxiosError } from 'axios';
import { useMessages, useMarkRead, useSendMessage, useUploadChatImage } from '../../services/chat.service';
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const showToast = useUiStore((s) => s.showToast);

  const { data, isLoading, fetchNextPage, hasNextPage } = useMessages(conversationId);
  const { mutate: markRead } = useMarkRead(conversationId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage(conversationId);
  const { mutate: uploadImage, isPending: uploading } = useUploadChatImage(conversationId);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only JPEG, PNG, GIF, and WebP images are allowed.', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5_242_880) {
      showToast('Image size cannot exceed 5MB.', 'error');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendImage = () => {
    if (!selectedFile || uploading) return;
    
    uploadImage(selectedFile, {
      onSuccess: (imageUrl) => {
        sendMessage(imageUrl, {
          onSuccess: () => {
            handleCancelImage();
            showToast('Image sent successfully', 'success');
          },
          onError: (err) => {
            const message = (err as AxiosError<{ message?: string }>).response?.data?.message
              ?? 'Failed to send image message.';
            showToast(message, 'error');
          },
        });
      },
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Failed to upload image.';
        showToast(message, 'error');
      },
    });
  };

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

      {/* Image Preview */}
      {imagePreview && (
        <div className="border-t border-[#e6e6e6] px-4 py-3 bg-[#f9fafb]">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border border-[#e6e6e6]"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-xs hover:bg-[#b91c1c]"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-[11px] text-[#737373]">
                {selectedFile?.name} ({(selectedFile!.size / 1024).toFixed(0)} KB)
              </p>
              <button
                type="button"
                onClick={handleSendImage}
                disabled={uploading}
                className="self-start px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#ad93e6] text-white hover:bg-[#9d7ed9] disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Send Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#e6e6e6] px-4 py-3 shrink-0 flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-9 w-9 shrink-0 rounded-full border border-[#e6e6e6] text-[#737373] flex items-center justify-center transition hover:bg-[#f4f3f7] hover:border-[#ad93e6] hover:text-[#ad93e6]"
          aria-label="Attach image"
          title="Attach image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>
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
