import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import AuctionCard from '../../components/card/AuctionCard';
import { useUiStore } from '../../stores/ui.store';
import type { Auction } from '../../types/landing';

interface AuctionsSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

const AuctionsSection = ({ sectionRef }: AuctionsSectionProps) => {
  const showToast = useUiStore((s) => s.showToast);
  const auctions: Auction[] = [];

  return (
    <section
      ref={sectionRef}
      className="bg-[rgba(244,243,247,0.4)] py-16"
      aria-label="Live Auctions"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(239,67,67,0.12)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.6px] text-[#ef4343]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef4343] animate-live-pulse" aria-hidden="true" />
              Live Now
            </span>
            <h2 className="mt-3 text-[30px] font-bold text-[#121212]">Live Auctions</h2>
            <p className="mt-1.5 text-[12px] text-[#737373]">
              Bid on rare &amp; limited K-pop collectibles. New drops every Friday.
            </p>
          </div>
          <Link
            to="/auction"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-[#ad93e6] transition-colors hover:text-[#9d7ed9]"
          >
            See All →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((a) => (
            <AuctionCard
              key={a.id}
              {...a}
              onBid={() => showToast(`Opened bid window for "${a.name}"`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuctionsSection;
