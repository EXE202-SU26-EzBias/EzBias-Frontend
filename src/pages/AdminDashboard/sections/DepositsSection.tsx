import React, { useState } from 'react';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import { useAdminPendingRefunds } from '../../../services/admin.service';
import DepositDetailModal from './DepositDetailModal';
import RefundQRModal from './RefundQRModal';

const DepositsSection = React.memo(function DepositsSection() {
  const [selectedDepositId, setSelectedDepositId] = useState<number | null>(null);
  const [refundingDepositId, setRefundingDepositId] = useState<number | null>(null);

  const { data: deposits = [], isLoading, refetch } = useAdminPendingRefunds();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <div>
      <SellerTopbar
        title="Deposit Management"
        sub="Process refunds for losing bidders"
      />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#b3b3b3] mb-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <p className="text-[15px] font-semibold text-[#121212] mb-1">
              No pending refunds
            </p>
            <p className="text-[13px] text-[#737373]">
              All deposits have been processed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[#e6e6e6]">
                <tr>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Deposit ID
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Auction
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    User
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Held At
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Payment Ref
                  </th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr
                    key={deposit.depositId}
                    className="border-b border-[#f4f4f4] last:border-0 hover:bg-[rgba(173,147,230,0.02)]"
                  >
                    <td className="px-5 py-4 text-[13px] text-[#121212]">
                      #{deposit.depositId}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[13px] font-medium text-[#121212] mb-0.5">
                          {deposit.auctionTitle}
                        </p>
                        <p className="text-[11px] text-[#737373] mb-0">
                          Auction #{deposit.auctionId}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[13px] font-medium text-[#121212] mb-0.5">
                          {deposit.userFullName}
                        </p>
                        <p className="text-[11px] text-[#737373] mb-0">
                          {deposit.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-[#121212]">
                      {formatCurrency(deposit.amount)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-[#737373]">
                      {formatDate(deposit.heldAt)}
                    </td>
                    <td className="px-5 py-4 text-[11px] font-mono text-[#737373]">
                      {deposit.paymentReference || 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDepositId(deposit.depositId)}
                          className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#e6e6e6] bg-white text-[#121212] hover:bg-[#f4f4f4] transition-colors"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setRefundingDepositId(deposit.depositId)}
                          className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors"
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedDepositId && (
        <DepositDetailModal
          depositId={selectedDepositId}
          onClose={() => setSelectedDepositId(null)}
        />
      )}

      {refundingDepositId && (
        <RefundQRModal
          depositId={refundingDepositId}
          onClose={() => setRefundingDepositId(null)}
          onRefundProcessed={() => {
            setRefundingDepositId(null);
            refetch();
          }}
        />
      )}
    </div>
  );
});

export default DepositsSection;
