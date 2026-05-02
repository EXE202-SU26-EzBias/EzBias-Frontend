import type { Auction } from '../../types/landing';

interface AuctionCardProps extends Auction {
  onBid: () => void;
}

const fmt = (v: number) => v.toLocaleString('vi-VN') + ' VNĐ';

const AuctionCard = ({ artist, name, currentBid, timer, isUrgent, image, onBid }: AuctionCardProps) => (
  <article className="overflow-hidden rounded-xl border border-[rgba(230,230,230,0.5)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
    {/* Image */}
    <div className="relative aspect-square overflow-hidden">
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

      {/* Timer badge */}
      <span
        className={[
          'absolute right-2.5 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold',
          isUrgent ? 'bg-[#ef4343] text-white' : 'bg-[#f0edf7] text-[#4e26a6]',
        ].join(' ')}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {timer}
      </span>
    </div>

    {/* Body */}
    <div className="flex flex-col gap-2 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#ad93e6]">{artist}</p>
      <h3 className="text-[13px] font-semibold text-[#121212]">{name}</h3>
      <div className="flex items-center justify-between gap-2 pt-1">
        <div>
          <p className="text-[12px] text-[#737373]">Current Bid</p>
          <p className="text-[18px] font-bold leading-tight text-[#121212]">{fmt(currentBid)}</p>
        </div>
        <button
          onClick={onBid}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#ad93e6] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#9d7ed9]"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Z"
            />
          </svg>
          Place Bid
        </button>
      </div>
    </div>
  </article>
);

export default AuctionCard;
