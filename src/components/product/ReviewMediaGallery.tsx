import { useEffect, useState } from 'react';
import type { ReviewMedia } from '../../types/review';

interface ReviewMediaGalleryProps {
  media: ReviewMedia[];
  compact?: boolean;
}

const ReviewMediaGallery = ({ media, compact = false }: ReviewMediaGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : media[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => current === null ? null : (current - 1 + media.length) % media.length);
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => current === null ? null : (current + 1) % media.length);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, media.length]);

  if (media.length === 0) return null;

  const visible = compact ? media.slice(0, 1) : media;

  return (
    <>
      <div className={compact ? 'flex items-center gap-2' : 'mt-3 grid max-w-xl grid-cols-3 gap-2 sm:grid-cols-4'}>
        {visible.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(media.findIndex((candidate) => candidate.id === item.id))}
            aria-label={`Open review ${item.type}`}
            className={[
              'group relative overflow-hidden rounded-xl border border-[#e6e6e6] bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#ad93e6]',
              compact ? 'h-12 w-12 shrink-0' : 'aspect-square',
            ].join(' ')}
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="Review attachment" loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            ) : item.thumbnailUrl ? (
              <img src={item.thumbnailUrl} alt="Review video preview" loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
            )}
            {item.type === 'video' && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white" aria-hidden="true">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm">▶</span>
              </span>
            )}
          </button>
        ))}
        {compact && (
          <button
            type="button"
            onClick={() => setActiveIndex(0)}
            className="whitespace-nowrap text-[11px] font-medium text-[#7c3aed] hover:underline"
          >
            {media.length} media
          </button>
        )}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review media preview"
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close preview"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ×
          </button>
          <div onClick={(event) => event.stopPropagation()} className="flex max-h-[94vh] max-w-[94vw] flex-col items-center gap-3">
            <div className="relative flex min-h-0 items-center justify-center">
              {media.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => current === null ? null : (current - 1 + media.length) % media.length)}
                  aria-label="Previous media"
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-3xl text-white hover:bg-black/80 sm:-left-16"
                >
                  ‹
                </button>
              )}

              {active.type === 'image' ? (
                <img
                  key={active.id}
                  src={active.url}
                  alt={`Review attachment ${activeIndex! + 1} of ${media.length}`}
                  className="max-h-[72vh] max-w-[90vw] rounded-xl object-contain"
                />
              ) : (
                <video
                  key={active.id}
                  src={active.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[72vh] max-w-[90vw] rounded-xl bg-black"
                />
              )}

              {media.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => current === null ? null : (current + 1) % media.length)}
                  aria-label="Next media"
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-3xl text-white hover:bg-black/80 sm:-right-16"
                >
                  ›
                </button>
              )}
            </div>

            <p className="text-sm font-medium text-white">
              {activeIndex! + 1} / {media.length}
            </p>

            {media.length > 1 && (
              <div className="flex max-w-[90vw] gap-2 overflow-x-auto rounded-xl bg-black/35 p-2">
                {media.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Open media ${index + 1}`}
                    aria-current={index === activeIndex}
                    className={[
                      'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-[#222]',
                      index === activeIndex ? 'border-[#ad93e6]' : 'border-transparent opacity-70 hover:opacity-100',
                    ].join(' ')}
                  >
                    {item.type === 'image' || item.thumbnailUrl ? (
                      <img
                        src={item.type === 'image' ? item.url : item.thumbnailUrl!}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                    )}
                    {item.type === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-xs text-white" aria-hidden="true">▶</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewMediaGallery;
