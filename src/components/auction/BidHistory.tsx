import type { BidHistoryEntry } from '../../types/auction';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';

interface BidHistoryProps {
  bids: BidHistoryEntry[];
  isLoading: boolean;
  isError: boolean;
}

const BidHistory = ({ bids, isLoading, isError }: BidHistoryProps) => {

  return (
    <section aria-label="Bid history">
      <h2 className="mb-4 text-base font-bold text-[#121212]">Bid History</h2>
      {isLoading ? (
        <p className="text-sm text-[#737373]">Loading bids...</p>
      ) : isError ? (
        <p className="text-sm text-[#737373]">Unable to load bid history.</p>
      ) : bids.length === 0 ? (
        <p className="text-sm text-[#737373]">No bids yet. Be the first!</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {bids.map((bid) => (
            <li
              key={bid.bidId}
              className="flex items-center justify-between rounded-xl border border-[#e6e6e6] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="bid-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ '--avatar-bg': bid.bidder.avatarBg || '#ad93e6' } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {bid.bidder.avatarUrl ? (
                    <img src={bid.bidder.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    bid.bidder.username.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#121212]">
                    {bid.bidder.username}
                    {bid.isWinning && (
                      <span className="ml-2 text-[11px] font-bold uppercase tracking-wide text-[#ad93e6]">Winning</span>
                    )}
                  </p>
                  <p className="text-xs text-[#737373]">{formatTimeAgo(bid.placedAt)}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-[#121212]">{formatCurrency(bid.amount)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BidHistory;
