export interface BidItem {
  id: string;
  user: string;
  avatar?: string;
  avatarBg?: string;
  timeAgo: string;
  amount: string;
  isWinning: boolean;
}

interface BidHistoryProps {
  bids: BidItem[];
}

const BidHistory = ({ bids }: BidHistoryProps) => (
  <section aria-label="Bid history">
    <h2 className="mb-4 text-base font-bold text-[#121212]">Bid History</h2>
    {bids.length === 0 ? (
      <p className="text-sm text-[#737373]">No bids yet. Be the first!</p>
    ) : (
      <ul className="flex flex-col gap-2">
        {bids.map((bid) => (
          <li
            key={bid.id}
            className="flex items-center justify-between rounded-xl border border-[#e6e6e6] bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className="bid-avatar grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                style={{ '--avatar-bg': bid.avatarBg ?? '#ad93e6' } as React.CSSProperties}
                aria-hidden="true"
              >
                {bid.avatar ?? bid.user.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#121212]">
                  {bid.user}
                  {bid.isWinning && (
                    <span className="ml-2 text-[11px] font-bold uppercase tracking-wide text-[#ad93e6]">
                      Winning
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#737373]">{bid.timeAgo}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-[#121212]">{bid.amount}</p>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default BidHistory;
