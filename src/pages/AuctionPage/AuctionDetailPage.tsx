import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BidHistory from '../../components/auction/BidHistory';
import CountdownTimer from '../../components/auction/CountdownTimer';
import DepositPanel from '../../components/auction/DepositPanel';
import PageLayout from '../../components/layout/PageLayout';
import AuctionWonModal from '../../components/shared/AuctionWonModal';
import BackLink from '../../components/ui/BackLink';
import Badge from '../../components/ui/Badge';
import { RocketIcon, TrendIcon } from '../../components/ui/Icon';
import { AUCTION_STATUS } from '../../constants/auction';
import { useCountdown } from '../../features/auction/useCountdown';
import { useAuctionHub } from '../../features/auction/useAuctionHub';
import { useAuctionDetail, useBidHistory, usePlaceBid } from '../../services/auction.service';
import { useDepositStatus } from '../../services/deposit.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { formatCurrency } from '../../utils/formatters';

const AuctionDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auctionId = Number(id);
  const { data: auction, isLoading } = useAuctionDetail(auctionId);
  const { mutate: placeBid, isPending: placing } = usePlaceBid(auctionId);
  const { data: bids = [], isLoading: bidsLoading, isError: bidsError } = useBidHistory(auctionId);
  const { hours, minutes, secs } = useCountdown(auction?.endsAt);
  const [bidInput, setBidInput] = useState('');

  // Subscribe to realtime bid events via SignalR
  useAuctionHub(auctionId);

  const currentUserId = useAuthStore((s) => s.user?.userId);
  const showToast = useUiStore((s) => s.showToast);
  const isLive = auction?.status === AUCTION_STATUS.LIVE || auction?.status === AUCTION_STATUS.EXTENDED;

  const { data: depositStatus } = useDepositStatus(auctionId);
  const depositRequired = (depositStatus?.requiredDepositAmount ?? 0) > 0;
  const depositHeld = depositStatus?.state === 'Held';
  const bidGateBlocked = depositRequired && !depositHeld;

  const userWon = Boolean(
    auction?.status === AUCTION_STATUS.ENDED_PENDING_PAYMENT &&
    currentUserId != null &&
    auction?.winnerId != null &&
    auction.winnerId === currentUserId
  );

  const handleBidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidInput(e.target.value.replace(/\D/g, ''));
  };

  const handlePlaceBid = () => {
    const amount = Number(bidInput);
    if (!amount) return;
    placeBid(amount, {
      onSuccess: () => setBidInput(''),
      onError: (err) => {
        const message =
          (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Failed to place bid. Please try again.';
        showToast(message, 'error');
      },
    });
  };

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1000px] px-4 py-10 md:py-14">
        <BackLink to="/auction" label="Back to Auctions" />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : auction ? (
          <>
            <div className="mb-10 flex flex-col gap-8 md:flex-row md:gap-12">
              {/* Image */}
              <div className="h-64 w-full shrink-0 overflow-hidden rounded-2xl border border-[#e6e6e6] bg-[#f4f3f7] md:h-72 md:w-80">
                <img
                  src={auction.product.primaryImageUrl ?? ''}
                  alt={auction.product.name}
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                  width="320"
                  height="288"
                />
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-4">
                <Badge variant={isLive ? 'live' : 'default'} dot>
                  {isLive ? 'LIVE AUCTION' : 'AUCTION'}
                </Badge>

                <h1 className="text-2xl font-bold leading-8 text-[#121212] md:text-3xl">{auction.product.name}</h1>

                <p className="text-sm leading-6 text-[#737373]">
                  {auction.product.artist} · {auction.product.type}
                </p>

                <CountdownTimer hours={hours} minutes={minutes} secs={secs} />

                <div className="flex items-end gap-10">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#737373]">Floor Price</p>
                    <p className="text-lg font-bold text-[#121212]">{formatCurrency(auction.floorPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#737373]">Current Highest Bid</p>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon className="h-4 w-4 text-[#ad93e6]" />
                      <p className="text-2xl font-bold text-[#ad93e6]">{formatCurrency(auction.currentBid)}</p>
                    </div>
                  </div>
                </div>

                {/* Deposit panel */}
                <DepositPanel auctionId={auctionId} isLive={isLive} />

                {/* Bid input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={bidInput}
                      onChange={handleBidInputChange}
                      placeholder={`${formatCurrency(auction.currentBid + 1000)} or higher`}
                      aria-label="Your bid amount in VND"
                      disabled={bidGateBlocked}
                      className="h-10 flex-1 rounded-lg border border-[#e6e6e6] px-4 text-sm text-[#121212] placeholder-[#b3b3b3] outline-none focus:border-[#ad93e6] focus:ring-2 focus:ring-[rgba(173,147,230,0.2)] disabled:bg-[#f5f5f5] disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handlePlaceBid}
                      disabled={placing || !isLive || !bidInput || bidGateBlocked}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#ad93e6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9] disabled:opacity-60"
                    >
                      <RocketIcon className="h-4 w-4" />
                      {placing ? 'Placing…' : 'Place Bid'}
                    </button>
                  </div>
                  {isLive && bidGateBlocked && (
                    <p className="text-[11px] text-[#737373]">Pay the required deposit above to unlock bidding.</p>
                  )}
                </div>
              </div>
            </div>

            <BidHistory bids={bids} isLoading={bidsLoading} isError={bidsError} />

            {userWon && (
              <AuctionWonModal
                auction={auction}
                onClose={() => navigate('/auction')}
                onProceedToPayment={(wonAuctionId) => navigate(`/checkout?auctionId=${wonAuctionId}`)}
              />
            )}
          </>
        ) : (
          <p className="py-16 text-center text-sm text-[#737373]">Auction not found.</p>
        )}
      </div>
    </PageLayout>
  );
};

export default AuctionDetailPage;
