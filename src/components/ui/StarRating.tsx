import { useState } from 'react';

interface StarRatingProps {
  /** Current value (1-5). For readonly display this can be fractional. */
  value: number;
  /** When set, stars become interactive and call this on click. */
  onChange?: (value: number) => void;
  /** Pixel size of each star. */
  size?: number;
  className?: string;
}

const FILLED = '#f59e0b';
const EMPTY = '#e6e6e6';

function Star({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true" focusable={false}>
      <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.56l-5.91 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" />
    </svg>
  );
}

const StarRating = ({ value, onChange, size = 18, className = '' }: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === 'function';
  const shown = hover || value;

  return (
    <div
      className={['inline-flex items-center gap-0.5', className].join(' ')}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={interactive ? 'Select a star rating' : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-checked={value === star}
            role="radio"
            className="cursor-pointer rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ad93e6]"
          >
            <Star fill={star <= shown ? FILLED : EMPTY} size={size} />
          </button>
        ) : (
          <Star key={star} fill={star <= Math.round(shown) ? FILLED : EMPTY} size={size} />
        ),
      )}
    </div>
  );
};

export default StarRating;
