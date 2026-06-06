import React from 'react';
import { formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import type { AdminPayoutListItem, PayoutStatus } from '../../../types/admin';

const STATUS_BADGE: Record<PayoutStatus, { label: string; cls: string }> = {
  1: { label: 'Pending',  cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  2: { label: 'Approved', cls: 'bg-green-50 text-green-700 border-green-200' },
  3: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200' },
};

interface PayoutRowProps {
  payout: AdminPayoutListItem;
  onApprove: (payout: AdminPayoutListItem) => void;
  onReject: (payout: AdminPayoutListItem) => void;
}

const PayoutRow = React.memo(function PayoutRow({ payout, onApprove, onReject }: PayoutRowProps) {
  const badge = STATUS_BADGE[payout.status];
  const isPending = payout.status === 1;

  return (
    <tr className="border-b border-[rgba(230,230,230,0.5)] hover:bg-[rgba(173,147,230,0.04)] transition-colors">
      {/* Seller */}
      <td className="px-4 py-[14px] align-middle">
        <div className="flex items-center gap-2.5">
          {payout.seller.avatarUrl ? (
            <img
              src={payout.seller.avatarUrl}
              alt={payout.seller.fullName}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[rgba(173,147,230,0.2)] flex items-center justify-center text-[#7C3AED] text-[12px] font-bold shrink-0">
              {payout.seller.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-[#121212] truncate">{payout.seller.fullName}</span>
            <span className="text-[11px] text-[#737373]">@{payout.seller.username}</span>
          </div>
        </div>
      </td>

      {/* Order */}
      <td className="px-4 py-[14px] align-middle whitespace-nowrap">
        <span className="text-[12px] font-mono text-[#737373]">#{payout.orderId}</span>
      </td>

      {/* Amount */}
      <td className="px-4 py-[14px] align-middle whitespace-nowrap">
        <span className="text-[13px] font-semibold text-[#121212]">{formatCurrency(payout.amount)}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-[14px] align-middle">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${badge.cls}`}>
          {badge.label}
        </span>
      </td>

      {/* Created */}
      <td className="px-4 py-[14px] align-middle text-[12px] text-[#737373] whitespace-nowrap">
        {formatTimeAgo(payout.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-[14px] align-middle">
        {isPending ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApprove(payout)}
              className="h-7 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[12px] font-semibold transition-colors"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReject(payout)}
              className="h-7 px-3 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-[12px] font-semibold transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </td>
    </tr>
  );
});

export default PayoutRow;
