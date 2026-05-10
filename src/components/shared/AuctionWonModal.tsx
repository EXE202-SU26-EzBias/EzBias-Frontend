import { useEffect, useRef } from 'react';
import type { AuctionDetail } from '../../types/auction';
import { formatCurrency } from '../../utils/formatters';

interface AuctionWonModalProps {
  auction: AuctionDetail;
  onClose: () => void;
  onProceedToPayment: (auctionId: number) => void;
}

const AuctionWonModal = ({ auction, onClose, onProceedToPayment }: AuctionWonModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auction-won-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl" aria-hidden="true">🎉</span>
          <h2 id="auction-won-title" className="text-xl font-bold text-[#121212]">
            You Won!
          </h2>
          <p className="text-sm text-[#737373]">
            Congratulations! You won{' '}
            <span className="font-semibold text-[#121212]">{auction.product.name}</span> with a bid of{' '}
            <span className="font-bold text-[#ad93e6]">{formatCurrency(auction.currentBid)}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onProceedToPayment(auction.auctionId)}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#ad93e6] text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9]"
          >
            Proceed to Payment
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center rounded-full border border-[#e6e6e6] text-sm font-medium text-[#737373] transition-colors hover:bg-[#f4f3f7]"
          >
            Pay Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionWonModal;
