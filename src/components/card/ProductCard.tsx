import { Link } from 'react-router-dom';
import { useAddToCart } from '../../features/cart/useAddToCart';
import { useProductQuantity } from '../../features/cart/useProductQuantity';
import type { FandomProduct } from '../../types/fandom';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ id, artist, name, price, primaryImageUrl, stock, isAuction }: FandomProduct) => {
  const { quantity, maxQuantity, isOutOfStock, increment, decrement } = useProductQuantity(stock);
  const { added, isPending, handleAdd } = useAddToCart();
  const showStepper = !isOutOfStock && maxQuantity > 1;

  return (
    <article className="overflow-hidden rounded-xl border border-[rgba(230,230,230,0.5)] bg-white shadow-[0_1px_2px_2px_rgba(0,0,0,0.09)]">
      {/* Image — clickable to detail page */}
      <Link to={`/fandoms/${id}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-square overflow-hidden">
          {isOutOfStock && (
            <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-[#f0f0f0] px-2.5 py-0.5 text-[10px] font-semibold text-[#737373]">
              Out of stock
            </span>
          )}
          <div
            className={[
              'absolute inset-0 grid place-items-center text-xl font-bold tracking-wide text-[#ad93e6]',
              primaryImageUrl ? 'bg-center bg-cover' : 'bg-gradient-to-br from-[#f0edf7] to-[#fcf6e8]',
            ].join(' ')}
            style={primaryImageUrl ? { backgroundImage: `url(${primaryImageUrl})` } : undefined}
          >
            {!primaryImageUrl && <span>{artist}</span>}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,243,247,0)_0%,rgba(143,143,145,0.11)_100%)]" />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#ad93e6]">{artist}</p>
        <Link to={`/fandoms/${id}`} className="hover:underline">
          <h3 className="min-h-9 text-[13px] font-semibold text-[#121212]">{name}</h3>
        </Link>
        {!isOutOfStock && (
          <p className={`text-[11px] font-medium ${stock <= 3 ? 'text-[#f59e0b]' : 'text-[#b3b3b3]'}`}>
            {stock <= 3 ? `Only ${stock} left` : `${stock} in stock`}
          </p>
        )}
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-sm font-bold text-[#121212]">{formatCurrency(price)}</span>
          {isAuction ? (
            <span className="inline-flex h-8 items-center justify-center rounded-full bg-[#f0edf7] px-3 text-[12px] font-medium text-[#7c3aed]">
              Auction item
            </span>
          ) : (
            <div className="flex items-center justify-evenly gap-2">
              {showStepper && (
                <div
                  role="group"
                  aria-label={`Quantity for ${name}`}
                  className="flex w-fit items-center rounded-full border border-[#e6e6e6] bg-white"
                >
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={decrement}
                    className="h-8 w-8 text-sm font-semibold text-[#121212] transition disabled:cursor-not-allowed disabled:text-[#b3b3b3]"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="min-w-8 px-1 text-center text-[12px] font-semibold text-[#121212]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= maxQuantity}
                    onClick={increment}
                    className="h-8 w-8 text-sm font-semibold text-[#121212] transition disabled:cursor-not-allowed disabled:text-[#b3b3b3]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                type="button"
                disabled={isOutOfStock || isPending}
                onClick={() => handleAdd(id, name, quantity)}
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
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
