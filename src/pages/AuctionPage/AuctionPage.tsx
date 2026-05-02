import AuctionCard from '../../components/card/AuctionCard';
import PageLayout from '../../components/layout/PageLayout';
import type { Auction } from '../../types/landing';

const AuctionPage = () => {
  const auctions: Auction[] = [];

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:py-16">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#121212] md:text-3xl">Live Auctions</h1>
          <p className="text-sm text-[#737373]">Bid on rare &amp; limited K-pop collectibles</p>
        </div>

        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" role="list">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} {...auction} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-[#737373]">No live auctions right now. Check back soon!</p>
        )}
      </div>
    </PageLayout>
  );
};

export default AuctionPage;
