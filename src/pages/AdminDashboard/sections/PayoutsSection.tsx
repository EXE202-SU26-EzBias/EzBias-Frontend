import React, { useMemo, useState } from 'react';
import { useAdminPayoutsFeature } from '../../../features/admin/useAdminPayoutsFeature';
import type { AdminPayoutListItem, PayoutStatus } from '../../../types/admin';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import PayoutApproveModal from './PayoutApproveModal';
import PayoutRejectModal from './PayoutRejectModal';
import PayoutRow from './PayoutRow';

type FilterTab = 'all' | PayoutStatus;

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 1,     label: 'Pending' },
  { id: 2,     label: 'Approved' },
  { id: 3,     label: 'Rejected' },
];

const COLUMNS = ['Seller', 'Order', 'Amount', 'Status', 'Created', 'Bank Ref', ''] as const;

function SkeletonRow() {
  return (
    <tr className="border-b border-[rgba(230,230,230,0.5)]">
      {COLUMNS.map((_, i) => (
        <td key={i} className="px-4 py-[14px]">
          <div
            className="h-4 rounded bg-[#f0f0f0] animate-pulse"
            style={{ width: i === 0 ? 140 : i === 6 ? 120 : 80 }}
          />
        </td>
      ))}
    </tr>
  );
}

const STAT_CONFIG = [
  { label: 'Total',    key: 'all' as const, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
  { label: 'Pending',  key: 1    as const,  color: '#d97706', bg: 'rgba(217,119,6,0.08)'  },
  { label: 'Approved', key: 2    as const,  color: '#16a34a', bg: 'rgba(22,163,74,0.08)'  },
  { label: 'Rejected', key: 3    as const,  color: '#dc2626', bg: 'rgba(220,38,38,0.08)'  },
] as const;

const PayoutsSection = React.memo(function PayoutsSection() {
  const {
    payouts,
    isLoading,
    isError,
    refetch,
    selectedPayout,
    modalMode,
    openApprove,
    openReject,
    closeModal,
    handleApprove,
    handleReject,
    isApprovePending,
    isRejectPending,
  } = useAdminPayoutsFeature();

  const [activeTab, setActiveTab] = useState<FilterTab>(1);

  const counts = useMemo<Record<'all' | 1 | 2 | 3, number>>(() => ({
    all: payouts.length,
    1: payouts.filter((p: AdminPayoutListItem) => p.status === 1).length,
    2: payouts.filter((p: AdminPayoutListItem) => p.status === 2).length,
    3: payouts.filter((p: AdminPayoutListItem) => p.status === 3).length,
  }), [payouts]);

  const filtered = useMemo(
    () => (activeTab === 'all' ? payouts : payouts.filter((p: AdminPayoutListItem) => p.status === activeTab)),
    [payouts, activeTab],
  );

  return (
    <div>
      <SellerTopbar title="Payout Queue" sub="Approve or reject seller withdrawal requests" />

      {/* Stats summary */}
      <div className="flex flex-wrap gap-3 mb-5">
        {STAT_CONFIG.map(({ label, key, color, bg }) => (
          <div
            key={label}
            style={{ background: bg, color, borderColor: color + '33' }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border"
          >
            <span className="text-[18px] font-bold leading-none">{counts[key]}</span>
            <span className="text-[12px] font-semibold opacity-80">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-[#e6e6e6]">
        {TABS.map((tab) => {
          const count = tab.id !== 'all' ? counts[tab.id] : undefined;
          return (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-[#737373] hover:text-[#121212]'
              }`}
            >
              {tab.label}
              {count !== undefined && count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(124,58,237,0.1)] text-[#7C3AED]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[14px] text-[#ef4343] font-medium">Failed to load payouts.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="h-8 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[12px] font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  : filtered.length === 0
                    ? (
                      <tr>
                        <td colSpan={COLUMNS.length} className="px-4 py-16 text-center text-[14px] text-[#737373]">
                          No payouts match this filter.
                        </td>
                      </tr>
                    )
                    : filtered.map((payout: AdminPayoutListItem) => (
                      <PayoutRow
                        key={payout.payoutId}
                        payout={payout}
                        onApprove={openApprove}
                        onReject={openReject}
                      />
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalMode === 'approve' && selectedPayout && (
        <PayoutApproveModal
          payout={selectedPayout}
          isPending={isApprovePending}
          onConfirm={handleApprove}
          onClose={closeModal}
        />
      )}
      {modalMode === 'reject' && selectedPayout && (
        <PayoutRejectModal
          payout={selectedPayout}
          isPending={isRejectPending}
          onConfirm={handleReject}
          onClose={closeModal}
        />
      )}
    </div>
  );
});

export default PayoutsSection;
