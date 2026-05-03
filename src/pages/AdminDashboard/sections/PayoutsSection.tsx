import React, { useMemo, useState } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import type { PayoutQueueItem, PayoutQueueStatus } from '../../../types/admin';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import { formatCurrency } from '../../../utils/formatters';

type ChipFilter = 'all' | PayoutQueueStatus;

const statusBadge: Record<PayoutQueueStatus, string> = {
  pending:  'bg-[#fff7ed] text-[#b45309]',
  approved: 'bg-[#f0fdf4] text-[#166534]',
  rejected: 'bg-[#fef2f2] text-[#ef4343]',
};

const PayoutsSection = React.memo(function PayoutsSection() {
  const { data } = useAdminDashboard();
  const [filter, setFilter] = useState<ChipFilter>('all');

  const { pendingItems, approvedItems, totalPending, chips, filtered } = useMemo(() => {
    const payouts = data?.payouts ?? [];
    const pending  = payouts.filter((p) => p.status === 'pending');
    const approved = payouts.filter((p) => p.status === 'approved');
    return {
      pendingItems:  pending,
      approvedItems: approved,
      totalPending:  pending.reduce((sum, p) => sum + p.amount, 0),
      chips: [
        { id: 'all'      as ChipFilter, label: 'All',      count: payouts.length                                     },
        { id: 'pending'  as ChipFilter, label: 'Pending',  count: pending.length                                     },
        { id: 'approved' as ChipFilter, label: 'Approved', count: approved.length                                    },
        { id: 'rejected' as ChipFilter, label: 'Rejected', count: payouts.filter((p) => p.status === 'rejected').length },
      ],
      filtered: filter === 'all' ? payouts : payouts.filter((p) => p.status === filter),
    };
  }, [data, filter]);

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Payout Queue" sub="Approve or reject seller withdrawal requests" />

      <div className="grid grid-cols-3 gap-4 mb-6 max-[900px]:grid-cols-1">
        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
          <p className="text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] m-0 mb-1">Pending requests</p>
          <p className="text-[28px] font-bold text-[#121212] m-0">{pendingItems.length}</p>
          <p className="text-[11px] text-[#b45309] m-0 mt-1">Awaiting review</p>
        </div>
        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
          <p className="text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] m-0 mb-1">Approved this week</p>
          <p className="text-[28px] font-bold text-[#121212] m-0">{approvedItems.length}</p>
          <p className="text-[11px] text-[#166534] m-0 mt-1">Processed successfully</p>
        </div>
        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
          <p className="text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] m-0 mb-1">Total amount pending</p>
          <p className="text-[22px] font-bold text-[#121212] m-0 truncate">{formatCurrency(totalPending)}</p>
          <p className="text-[11px] text-[#737373] m-0 mt-1">Across all pending requests</p>
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Payout requests</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`h-9 px-[14px] rounded-full border text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
                  filter === chip.id
                    ? 'bg-[#ad93e6] border-[#ad93e6] text-white'
                    : 'border-[#e6e6e6] bg-white text-[#121212] hover:border-[#ad93e6] hover:text-[#ad93e6]'
                }`}
              >
                {chip.label}
                <span className="text-[11px] opacity-70">{chip.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Request ID', 'Seller', 'Amount', 'Method', 'Requested At', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: PayoutQueueItem) => (
                <tr key={p.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#737373] align-middle text-[13px] font-medium">{p.id}</td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px] font-medium">{p.seller}</td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px] font-semibold">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-[14px] text-[#737373] align-middle text-[13px]">{p.method}</td>
                  <td className="px-4 py-[14px] text-[#737373] align-middle text-[13px]">{p.requestedAt}</td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[p.status]}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    {p.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button className="h-7 px-3 rounded-lg bg-[#ad93e6] text-white text-[12px] font-medium hover:bg-[#9d7ed9] transition-colors">
                          Approve
                        </button>
                        <button className="h-7 px-3 rounded-lg border border-[#ef4343] text-[#ef4343] text-[12px] font-medium hover:bg-[#fef2f2] transition-colors">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#b3b3b3]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default PayoutsSection;
