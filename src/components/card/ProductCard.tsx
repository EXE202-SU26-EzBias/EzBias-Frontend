import { useState } from 'react';
import type { Product } from '../../types/landing';
import { useCartStore } from '../../stores/cart.store';
import { useUiStore } from '../../stores/ui.store';

const fmt = (v: number) => v.toLocaleString('vi-VN') + ' VNĐ';

const ProductCard = ({ artist, name, price, image, isBoosted, stock }: Product) => {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUiStore((s) => s.showToast);
  const isOutOfStock = stock != null && stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem({ artist, name, price, image, isBoosted, stock });
    showToast(`Added "${name}" to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-[rgba(230,230,230,0.5)] bg-white shadow-[0_1px_2px_2px_rgba(0,0,0,0.09)]">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {isBoosted && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[#7c3aed] px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            Boosted
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-[#f0f0f0] px-2.5 py-0.5 text-[10px] font-semibold text-[#737373]">
            Out of stock
          </span>
        )}
        <div
          className="absolute inset-0 grid place-items-center text-xl font-bold tracking-wide text-[#ad93e6]"
          style={
            image
              ? { background: `center/cover url(${image})` }
              : { background: 'linear-gradient(135deg, #f0edf7 0%, #fcf6e8 100%)' }
          }
        >
          {!image && <span>{artist}</span>}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,243,247,0)_0%,rgba(143,143,145,0.11)_100%)]" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#ad93e6]">
          {artist}
        </p>
        <h3 className="min-h-9 cursor-pointer text-[13px] font-semibold text-[#121212] transition-colors hover:text-[#ad93e6]">
          {name}
        </h3>
        {stock != null && !isOutOfStock && (
          <p className={`text-[11px] font-medium ${stock <= 3 ? 'text-[#f59e0b]' : 'text-[#b3b3b3]'}`}>
            {stock <= 3 ? `Only ${stock} left` : `${stock} in stock`}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-bold text-[#121212]">{fmt(price)}</span>
          <button
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={[
              'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors',
              isOutOfStock
                ? 'cursor-not-allowed bg-[#b3b3b3] text-white opacity-80'
                : added
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-[#ad93e6] text-white hover:bg-[#9d7ed9]',
            ].join(' ')}
          >
            {!added && !isOutOfStock && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
            {added ? 'Added!' : isOutOfStock ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
