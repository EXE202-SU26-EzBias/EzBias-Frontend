import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import ChatPanel from '../../components/chat/ChatPanel';
import PageLayout from '../../components/layout/PageLayout';
import BackLink from '../../components/ui/BackLink';
import { useAddToCart } from '../../features/cart/useAddToCart';
import { useProductQuantity } from '../../features/cart/useProductQuantity';
import { useStartConversation } from '../../services/chat.service';
import { useCatalogProductDetail } from '../../services/fandom.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { formatCurrency } from '../../utils/formatters';
import ReviewsSection from '../../components/product/ReviewsSection';
import type { Conversation } from '../../types/chat';

const CONDITION_LABELS: Record<number, string> = {
  1: 'Brand New',
  2: 'Like New',
  3: 'Good',
  4: 'Acceptable',
};

const ProductDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, isError } = useCatalogProductDetail(productId);

  const [activeImg, setActiveImg] = useState(0);
  const [chatConversation, setChatConversation] = useState<Conversation | null>(null);
  const { quantity, maxQuantity, isOutOfStock, increment, decrement } = useProductQuantity(
    product?.stock ?? 0,
  );
  const { added, isPending, handleAdd } = useAddToCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: startConversation, isPending: startingChat } = useStartConversation();

  const handleMessageSeller = () => {
    if (!product) return;
    startConversation(
      { counterpartId: product.sellerId, productId: product.id },
      {
        onSuccess: (conv) => setChatConversation(conv),
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message
            ?? 'Could not open chat. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  };

  const images =
    product?.imageUrls?.length
      ? product.imageUrls
      : product?.primaryImageUrl
        ? [product.primaryImageUrl]
        : [];

  return (
    <>
    <PageLayout>
      <div className="mx-auto w-full max-w-[1000px] px-4 py-10 md:py-14">
        <BackLink to="/fandoms" label="Back to Fandoms" />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : isError || !product ? (
          <p className="py-16 text-center text-sm text-[#737373]">Product not found.</p>
        ) : (
          <>
          <div className="mt-6 flex flex-col gap-10 md:flex-row md:gap-12">
            {/* ── Images ── */}
            <div className="flex flex-col gap-3 md:w-80 md:shrink-0">
              {/* Main image */}
              <div className="aspect-square overflow-hidden rounded-2xl border border-[#e6e6e6] bg-[#f4f3f7]">
                {images[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg font-bold text-[#ad93e6]">
                    {product.artist}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`View image ${i + 1}`}
                      className={[
                        'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition',
                        i === activeImg
                          ? 'border-[#ad93e6]'
                          : 'border-[#e6e6e6] hover:border-[#ad93e6]',
                      ].join(' ')}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.6px] text-[#ad93e6]">
                  {product.artist}
                </p>
                <h1 className="text-2xl font-bold leading-tight text-[#121212] md:text-3xl">
                  {product.name}
                </h1>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[11px] font-medium text-[#737373]">
                  {product.type}
                </span>
                <span className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[11px] font-medium text-[#737373]">
                  {CONDITION_LABELS[product.condition] ?? 'Unknown condition'}
                </span>
                {isOutOfStock ? (
                  <span className="rounded-full bg-[#f0f0f0] px-3 py-1 text-[11px] font-semibold text-[#737373]">
                    Out of stock
                  </span>
                ) : product.stock <= 3 ? (
                  <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-[11px] font-semibold text-[#d97706]">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-[11px] font-semibold text-[#16a34a]">
                    {product.stock} in stock
                  </span>
                )}
              </div>

              {/* Price */}
              <p className="text-2xl font-bold text-[#121212]">{formatCurrency(product.price)}</p>

              {/* Description */}
              {product.description && (
                <p className="text-sm leading-relaxed text-[#737373]">{product.description}</p>
              )}

              {/* Add to cart */}
              {!product.isAuction && (
                <div className="flex items-center gap-3 pt-1">
                  {!isOutOfStock && maxQuantity > 1 && (
                    <div
                      role="group"
                      aria-label={`Quantity for ${product.name}`}
                      className="flex items-center rounded-full border border-[#e6e6e6] bg-white"
                    >
                      <button
                        type="button"
                        disabled={quantity <= 1}
                        onClick={decrement}
                        className="h-10 w-10 text-sm font-semibold text-[#121212] transition disabled:cursor-not-allowed disabled:text-[#b3b3b3]"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-8 px-1 text-center text-[13px] font-semibold text-[#121212]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={quantity >= maxQuantity}
                        onClick={increment}
                        className="h-10 w-10 text-sm font-semibold text-[#121212] transition disabled:cursor-not-allowed disabled:text-[#b3b3b3]"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isOutOfStock || isPending}
                    onClick={() => handleAdd(product.id, product.name, quantity)}
                    className={[
                      'inline-flex h-10 items-center gap-2 rounded-full px-6 text-[13px] font-semibold transition-colors',
                      isOutOfStock
                        ? 'cursor-not-allowed bg-[#b3b3b3] text-white opacity-80'
                        : added
                          ? 'bg-[#22c55e] text-white'
                          : 'bg-[#ad93e6] text-white hover:bg-[#9d7ed9]',
                    ].join(' ')}
                  >
                    {!added && !isOutOfStock && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                    {added ? 'Added to cart!' : isOutOfStock ? 'Sold out' : 'Add to cart'}
                  </button>
                </div>
              )}

              {product.isAuction && (
                <p className="inline-flex w-fit rounded-full bg-[#f0edf7] px-4 py-2 text-[13px] font-medium text-[#7c3aed]">
                  This item is available via auction only
                </p>
              )}

              {/* Message Seller */}
              {isAuthenticated && (
                <button
                  type="button"
                  disabled={startingChat}
                  onClick={handleMessageSeller}
                  className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-[#ad93e6] px-5 text-[13px] font-semibold text-[#ad93e6] transition-colors hover:bg-[rgba(173,147,230,0.08)] disabled:opacity-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {startingChat ? 'Opening…' : 'Message Seller'}
                </button>
              )}
            </div>
          </div>
          <ReviewsSection productId={product.id} />
          </>
        )}
      </div>
    </PageLayout>
    {chatConversation && (
      <ChatPanel
        conversation={chatConversation}
        onClose={() => setChatConversation(null)}
      />
    )}
    </>
  );
};

export default ProductDetailPage;
