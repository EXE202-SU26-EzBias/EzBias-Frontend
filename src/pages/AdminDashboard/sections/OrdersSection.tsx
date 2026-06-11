import React, { useState } from 'react';
import { useAdminTransactions } from '../../../services/admin.service';
import type { AdminTransactionItem } from '../../../types/admin';
import { formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

// ==================== Filter type ====================

type FilterKind = 'all' | 'payment' | 'payout' | 'deposit' | 'refund';

// ==================== Status badge ====================

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const cls =
    lower === 'paid' || lower === 'approved'
      ? 'bg-[rgba(34,197,94,0.1)] text-[#16a34a] border-[rgba(34,197,94,0.3)]'
      : lower === 'pending'
      ? 'bg-[rgba(245,158,11,0.1)] text-[#d97706] border-[rgba(245,158,11,0.3)]'
      : lower === 'rejected' || lower === 'failed' || lower === 'refunded'
      ? 'bg-[rgba(239,67,67,0.1)] text-[#ef4343] border-[rgba(239,67,67,0.3)]'
      : 'bg-[#f5f5f5] text-[#737373] border-[#e6e6e6]';

  return (
    <span className={`inline-flex items-center px-[9px] py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

// ==================== Direction badge ====================

function DirectionBadge({ direction, kind }: { direction: 'in' | 'out'; kind: string }) {
  const LABELS: Record<string, string> = {
    payment: '↓ Buyer → Sàn',
    deposit: '↓ Cọc đấu giá',
    payout:  '↑ Sàn → Seller',
    refund:  '↑ Hoàn tiền',
  };
  const isIn = direction === 'in';
  return (
    <span
      className={`inline-flex items-center gap-1 px-[9px] py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
        isIn
          ? 'bg-[rgba(59,130,246,0.08)] text-[#3b82f6] border-[rgba(59,130,246,0.25)]'
          : 'bg-[rgba(173,147,230,0.1)] text-[#7c3aed] border-[rgba(173,147,230,0.3)]'
      }`}
    >
      {LABELS[kind] ?? (isIn ? '↓ In' : '↑ Out')}
    </span>
  );
}

// ==================== Table row ====================

function TxRow({ tx }: { tx: AdminTransactionItem }) {
  return (
    <tr className="border-b border-[rgba(230,230,230,0.5)] hover:bg-[rgba(173,147,230,0.04)] transition-colors">
      <td className="px-4 py-[13px] text-[#737373] text-[12px] whitespace-nowrap">#{tx.id}</td>
      <td className="px-4 py-[13px] align-middle">
        <DirectionBadge direction={tx.direction} kind={tx.kind} />
      </td>
      <td className="px-4 py-[13px] align-middle">
        <StatusBadge status={tx.status} />
      </td>
      <td className="px-4 py-[13px] text-[13px] font-semibold text-[#121212] whitespace-nowrap">
        {formatCurrency(tx.amount)}
      </td>
      <td className="px-4 py-[13px] align-middle">
        <div className="flex flex-col">
          <span className="text-[12px] text-[#121212] font-medium">{tx.buyerUsername ?? '—'}</span>
          <span className="text-[11px] text-[#737373]">{tx.buyerEmail ?? ''}</span>
        </div>
      </td>
      <td className="px-4 py-[13px] align-middle">
        <div className="flex flex-col">
          <span className="text-[12px] text-[#121212] font-medium">{tx.sellerUsername ?? '—'}</span>
          <span className="text-[11px] text-[#737373]">{tx.sellerEmail ?? ''}</span>
        </div>
      </td>
      <td className="px-4 py-[13px] text-[#737373] text-[12px] whitespace-nowrap">
        {tx.orderId ? `#${tx.orderId}` : '—'}
      </td>
      <td className="px-4 py-[13px] text-[#737373] text-[11px] max-w-[160px] truncate" title={tx.reference}>
        {tx.reference || '—'}
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#737373] whitespace-nowrap">
        {formatTimeAgo(tx.createdAt)}
      </td>
      <td className="px-4 py-[13px] text-[12px] text-[#737373] whitespace-nowrap">
        {tx.settledAt ? formatTimeAgo(tx.settledAt) : '—'}
      </td>
    </tr>
  );
}

// ==================== Main ====================

const COLS = ['#', 'Loại', 'Trạng thái', 'Số tiền', 'Buyer', 'Seller', 'Order', 'Mã tham chiếu', 'Tạo lúc', 'Hoàn thành'] as const;

const OrdersSection = React.memo(function OrdersSection() {
  const { data: transactions = [], isLoading, isError, refetch } = useAdminTransactions();
  const [filter, setFilter] = useState<FilterKind>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.kind === filter);

  const countAll = transactions.length;
  const countPayment = transactions.filter((t) => t.kind === 'payment').length;
  const countPayout = transactions.filter((t) => t.kind === 'payout').length;
  const countDeposit = transactions.filter((t) => t.kind === 'deposit').length;
  const countRefund = transactions.filter((t) => t.kind === 'refund').length;

  return (
    <div>
      <SellerTopbar title="Transaction History" sub="Lịch sử chuyển tiền qua sàn" />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5 bg-white border border-[rgba(230,230,230,0.5)] rounded-xl px-4 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {([
          { id: 'all' as FilterKind,     label: 'Tất cả',          count: countAll     },
          { id: 'payment' as FilterKind, label: 'Buyer → Sàn',     count: countPayment },
          { id: 'deposit' as FilterKind, label: 'Cọc đấu giá',     count: countDeposit },
          { id: 'payout' as FilterKind,  label: 'Sàn → Seller',    count: countPayout  },
          { id: 'refund' as FilterKind,  label: 'Hoàn tiền',       count: countRefund  },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${
              filter === tab.id
                ? 'bg-[#ad93e6] text-white'
                : 'text-[#737373] hover:bg-[rgba(173,147,230,0.1)] hover:text-[#121212]'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              filter === tab.id ? 'bg-white/25 text-white' : 'bg-[#f0f0f0] text-[#737373]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-[14px] text-[#ef4343]">Không thể tải dữ liệu giao dịch.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-[12px] font-medium px-4 h-8 rounded-full border border-[#e6e6e6] bg-white text-[#737373] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="px-5 py-16 text-center text-[14px] text-[#737373]">Không có giao dịch nào.</p>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {COLS.map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <TxRow key={`${tx.kind}-${tx.id}`} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export default OrdersSection;
