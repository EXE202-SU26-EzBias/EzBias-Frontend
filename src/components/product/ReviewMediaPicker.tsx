import { useRef } from 'react';
import type { PendingReviewMedia } from '../../features/review/useReviewForm';
import type { ReviewMedia } from '../../types/review';

interface ReviewMediaPickerProps {
  existingMedia?: ReviewMedia[];
  keptMediaIds: number[];
  newMedia: PendingReviewMedia[];
  onAddFiles: (files: File[]) => Promise<void>;
  onToggleExisting: (id: number) => void;
  onRemoveNew: (id: string) => void;
  disabled?: boolean;
}

const ReviewMediaPicker = ({
  existingMedia = [],
  keptMediaIds,
  newMedia,
  onAddFiles,
  onToggleExisting,
  onRemoveNew,
  disabled = false,
}: ReviewMediaPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-dashed border-[#d8d1e8] bg-white p-3.5">
      {(existingMedia.length > 0 || newMedia.length > 0) && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {existingMedia.map((item) => {
            const kept = keptMediaIds.includes(item.id);
            return (
              <div key={item.id} className={`relative aspect-square overflow-hidden rounded-lg bg-[#f5f5f5] ${kept ? '' : 'opacity-40'}`}>
                {item.type === 'image' ? (
                  <img src={item.url} alt="Existing review attachment" className="h-full w-full object-cover" />
                ) : (
                  <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggleExisting(item.id)}
                  aria-label={kept ? 'Remove existing media' : 'Keep existing media'}
                  className="absolute right-1 top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-black/70 px-1.5 text-[11px] font-semibold text-white"
                >
                  {kept ? '×' : 'Undo'}
                </button>
              </div>
            );
          })}

          {newMedia.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg bg-[#f5f5f5]">
              {item.type === 'image' ? (
                <img src={item.url} alt="New review attachment preview" className="h-full w-full object-cover" />
              ) : (
                <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemoveNew(item.id)}
                aria-label="Remove selected media"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-base text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        disabled={disabled}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = '';
          void onAddFiles(files);
        }}
        className="hidden"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-9 items-center rounded-full border border-[#ad93e6] px-4 text-[12px] font-semibold text-[#7c3aed] transition-colors hover:bg-[#f7f4fc] disabled:opacity-50"
      >
        Add photos or video
      </button>
      <p className="mt-2 text-[11px] leading-relaxed text-[#8a8a8a]">
        Up to 5 images (5MB each) and 1 video (50MB, 60 seconds), 6 files total.
      </p>
    </div>
  );
};

export default ReviewMediaPicker;
