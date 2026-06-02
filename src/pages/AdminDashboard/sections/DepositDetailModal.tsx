import React, { useState } from 'react';
import type { AxiosError } from 'axios';
import { useAdminDepositDetail, useProcessManualRefund } from '../../../services/admin.service';
import { useUiStore } from '../../../stores/ui.store';

interface DepositDetailModalProps {
  depositId: number;
  onClose: () => void;
  onRefundProcessed: () => void;
}

const DepositDetailModal = React.memo(function DepositDetailModal({
  depositId,
  onClose,
  onRefundProcessed,
}: DepositDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: deposit, isLoading } = useAdminDepositDetail(depositId);
  const { mutate: processRefund } = useProcessManualRefund();
  const showToast = useUiStore((s) => s.showToast);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(dateString));
  };

  const handleProcessRefund = () => {
    const confirmed = window.confirm(
      `Are you sure you want to process a refund of ${formatCurrency(deposit!.amount)} for ${deposit!.userFullName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    processRefund(
      { depositId, reason: 'Manual refund by admin - losing bidder' },
      {
        onSuccess: () => {
          showToast('Refund processed successfully', 'success');
          setIsProcessing(false);
          onRefundProcessed();
        },
        onError: (err) => {
          const message =
            (err as AxiosError<{ message?: string }>).response?.data?.message ??
            'Failed to process refund. Please try again.';
          showToast(message, 'error');
          setIsProcessing(false);
        },
      }
    );
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'Held':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refunded':
        return 'bg-green-100 text-green-800';
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Forfeited':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuctionStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
      case 'Extended':
        return 'bg-green-100 text-green-800';
      case 'Ended':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#e6e6e6] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#121212]">
            Deposit Details #{depositId}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#e6e6e6] flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#f4f4f4] transition-colors"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        ) : deposit ? (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-2">
                  Deposit State
                </p>
                <span
                  className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStateColor(deposit.state)}`}
                >
                  {deposit.state}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-2">
                  Amount
                </p>
                <p className="text-[15px] font-bold text-[#121212]">
                  {formatCurrency(deposit.amount)}
                </p>
              </div>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6 mb-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">
                Auction Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Auction Title
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    {deposit.auctionTitle}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Auction ID
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    #{deposit.auctionId}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Auction Status
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${getAuctionStatusColor(deposit.auctionStatus)}`}
                  >
                    {deposit.auctionStatus}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Winner ID
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    {deposit.winnerId ? `#${deposit.winnerId}` : 'No winner yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6 mb-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">
                User Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Full Name
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    {deposit.userFullName}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Email
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    {deposit.userEmail}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    User ID
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    #{deposit.userId}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6 mb-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Payment Reference
                  </p>
                  <p className="text-[11px] font-mono text-[#121212]">
                    {deposit.paymentReference || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Payment ID
                  </p>
                  <p className="text-[13px] text-[#121212]">
                    {deposit.paymentId ? `#${deposit.paymentId}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">
                Timestamps
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Created At
                  </p>
                  <p className="text-[13px] text-[#737373]">
                    {formatDate(deposit.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                    Held At
                  </p>
                  <p className="text-[13px] text-[#737373]">
                    {formatDate(deposit.heldAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[13px] text-[#737373]">Deposit not found</p>
          </div>
        )}

        {deposit && deposit.state === 'Held' && (
          <div className="border-t border-[#e6e6e6] px-6 py-4 bg-[#f9fafb] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[#e6e6e6] bg-white text-[#121212] hover:bg-[#f4f4f4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProcessRefund}
              disabled={isProcessing}
              className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Process Refund'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default DepositDetailModal;
