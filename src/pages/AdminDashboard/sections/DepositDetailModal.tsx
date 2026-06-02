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
  const [showQR, setShowQR] = useState(false);
  const [qrError, setQrError] = useState(false);

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
      `Confirm that you have transferred ${formatCurrency(deposit!.amount)} to ${deposit!.userFullName}'s bank account?\n\nThis will mark the deposit as refunded and notify the user.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    processRefund(
      { depositId, reason: 'Manual refund by admin - deposit refunded via bank transfer' },
      {
        onSuccess: () => {
          showToast('Refund marked as processed successfully', 'success');
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

  // Map bank names to VietQR bank codes
  const getBankCode = (bankName: string | null): string => {
    if (!bankName) return '';
    const name = bankName.toLowerCase();
    
    // Common Vietnamese banks
    if (name.includes('vietcombank') || name.includes('vcb')) return 'VCB';
    if (name.includes('techcombank') || name.includes('tcb')) return 'TCB';
    if (name.includes('vietinbank') || name.includes('ctg')) return 'CTG';
    if (name.includes('agribank')) return 'AGR';
    if (name.includes('bidv')) return 'BIDV';
    if (name.includes('mbbank') || name.includes('mb')) return 'MB';
    if (name.includes('acb')) return 'ACB';
    if (name.includes('vpbank')) return 'VPB';
    if (name.includes('sacombank')) return 'STB';
    if (name.includes('tpbank')) return 'TPB';
    if (name.includes('vib')) return 'VIB';
    if (name.includes('hdbank')) return 'HDB';
    if (name.includes('ocb')) return 'OCB';
    if (name.includes('shb')) return 'SHB';
    if (name.includes('seabank')) return 'SEAB';
    
    return 'VCB'; // default fallback
  };

  const buildQRUrl = (): string => {
    if (!deposit) return '';
    
    const bankCode = getBankCode(deposit.bankName);
    const accountNumber = deposit.bankAccountNumber || '';
    const amount = deposit.amount;
    const description = `Refund deposit auction ${deposit.auctionId}`;
    
    // VietQR API format: https://img.vietqr.io/image/{BANK_BIN}-{ACCOUNT_NO}-{TEMPLATE}.jpg?amount={AMOUNT}&addInfo={DESCRIPTION}
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}`;
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
                Bank Information
              </h3>
              {deposit.bankName && deposit.bankAccountNumber ? (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                      Bank Name
                    </p>
                    <p className="text-[13px] text-[#121212] font-medium">
                      {deposit.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                      Account Number
                    </p>
                    <p className="text-[13px] text-[#121212] font-mono font-medium">
                      {deposit.bankAccountNumber}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">
                      Account Name
                    </p>
                    <p className="text-[13px] text-[#121212] font-medium">
                      {deposit.bankAccountName || deposit.userFullName}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-[12px] text-amber-800">
                    ⚠️ User has not provided bank information yet. Please contact the user directly.
                  </p>
                </div>
              )}
              
              {deposit.bankName && deposit.bankAccountNumber && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="w-full px-4 py-2.5 text-[13px] font-medium rounded-lg border-2 border-[#ad93e6] text-[#7c5ac4] hover:bg-[rgba(173,147,230,0.1)] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    {showQR ? 'Hide QR Code' : 'Show QR Code for Transfer'}
                  </button>
                  
                  {showQR && (
                    <div className="mt-4 p-6 bg-white border-2 border-[#ad93e6] rounded-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="overflow-hidden rounded-xl border border-[#e6e6e6]">
                          {qrError ? (
                            <div className="flex h-[200px] w-[200px] items-center justify-center bg-[#f9f9f9] p-3 text-center text-[11px] text-[#737373]">
                              QR unavailable — use account details to transfer manually.
                            </div>
                          ) : (
                            <img
                              src={buildQRUrl()}
                              alt="VietQR Code"
                              width={200}
                              height={200}
                              className="block"
                              onError={() => setQrError(true)}
                            />
                          )}
                        </div>
                        <div className="text-center w-full">
                          <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-2">
                            Transfer Details
                          </p>
                          <div className="space-y-1">
                            <p className="text-[12px] text-[#121212]">
                              <span className="font-semibold text-[#737373]">Bank:</span>{' '}
                              <span className="font-medium">{deposit.bankName}</span>
                            </p>
                            <p className="text-[12px] text-[#121212]">
                              <span className="font-semibold text-[#737373]">Account:</span>{' '}
                              <span className="font-mono font-medium">{deposit.bankAccountNumber}</span>
                            </p>
                            <p className="text-[12px] text-[#121212]">
                              <span className="font-semibold text-[#737373]">Name:</span>{' '}
                              <span className="font-medium">{deposit.bankAccountName || deposit.userFullName}</span>
                            </p>
                            <p className="text-[15px] text-[#7c5ac4] font-bold mt-3">
                              {formatCurrency(deposit.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              disabled={isProcessing || !deposit.bankName || !deposit.bankAccountNumber}
              className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={!deposit.bankName || !deposit.bankAccountNumber ? 'User must provide bank information first' : ''}
            >
              {isProcessing ? 'Processing...' : 'Confirm Transfer & Mark Refunded'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default DepositDetailModal;
