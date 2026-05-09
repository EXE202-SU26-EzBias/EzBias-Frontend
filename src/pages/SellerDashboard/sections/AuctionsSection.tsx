import React, { useCallback, useMemo, useState } from 'react';
import {
  useCancelSellerAuction,
  usePublishSellerAuction,
  useRelistSellerAuction,
  useSellerAuctions,
} from '../../../services/seller-auction.service';
import { useUiStore } from '../../../stores/ui.store';
import type { SellerAuctionStatus } from '../../../types/seller';
import AuctionFormModal from '../AuctionFormModal';
import AuctionsTable from '../AuctionsTable';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

type FilterTab = 'all' | SellerAuctionStatus;

const TABS: { label: string; value: FilterTab }[] = [
  { label: 'All',             value: 'all' },
  { label: 'Draft',           value: 1 },
  { label: 'Live',            value: 2 },
  { label: 'Extended',        value: 3 },
  { label: 'Ended',           value: 4 },
  { label: 'Pending payment', value: 5 },
  { label: 'Winner failed',   value: 6 },
  { label: 'Sold',            value: 7 },
  { label: 'Cancelled',       value: 8 },
];

const AuctionsSection = React.memo(function AuctionsSection() {
  const { data: auctions = [], isLoading, isError } = useSellerAuctions();
  const { mutate: publishMutate, isPending: publishPending } = usePublishSellerAuction();
  const { mutate: cancelMutate,  isPending: cancelPending  } = useCancelSellerAuction();
  const { mutate: relistMutate,  isPending: relistPending  } = useRelistSellerAuction();
  const showToast = useUiStore((s) => s.showToast);

  const [tab, setTab] = useState<FilterTab>('all');
  const [showModal, setShowModal] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (tab === 'all' ? auctions : auctions.filter((a) => a.status === tab)),
    [auctions, tab],
  );

  const handleCloseModal = useCallback(() => setShowModal(false), []);

  const handlePublish = useCallback(
    (id: number) => {
      setPendingId(id);
      publishMutate(id, {
        onSuccess: () => setPendingId(null),
        onError: () => { setPendingId(null); showToast('Failed to publish auction.'); },
      });
    },
    [publishMutate, showToast],
  );

  const handleCancel = useCallback(
    (id: number) => {
      setPendingId(id);
      cancelMutate(id, {
        onSuccess: () => setPendingId(null),
        onError: () => { setPendingId(null); showToast('Failed to cancel auction.'); },
      });
    },
    [cancelMutate, showToast],
  );

  const handleRelist = useCallback(
    (id: number) => {
      setPendingId(id);
      relistMutate(id, {
        onSuccess: () => setPendingId(null),
        onError: () => { setPendingId(null); showToast('Failed to relist auction.'); },
      });
    },
    [relistMutate, showToast],
  );

  const isAnyPending = publishPending || cancelPending || relistPending;

  return (
    <div>
      <SellerTopbar title="Auctions" sub="Track live and ended auctions you host" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">
              All auctions{' '}
              <span className="text-[#737373] font-normal text-[14px]">({auctions.length})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center gap-1.5"
          >
            {Icons.plus} New auction
          </button>
        </div>

        <div className="flex items-center gap-1 px-5 py-2 border-b border-[rgba(230,230,230,0.5)] overflow-x-auto">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap ${
                tab === value
                  ? 'bg-[#ad93e6] text-white'
                  : 'text-[#737373] hover:bg-[rgba(173,147,230,0.1)] hover:text-[#121212]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && <p className="px-5 py-6 text-[14px] text-[#737373]">Loading…</p>}
        {isError && (
          <p className="px-5 py-6 text-[14px] text-[#ef4343]">Failed to load auctions. Please try again.</p>
        )}
        {!isLoading && !isError && (
          <AuctionsTable
            auctions={filtered}
            onPublish={handlePublish}
            onCancel={handleCancel}
            onRelist={handleRelist}
            pendingId={isAnyPending ? pendingId : null}
          />
        )}
      </div>

      {showModal && <AuctionFormModal onClose={handleCloseModal} />}
    </div>
  );
});

export default AuctionsSection;
