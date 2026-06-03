import React, { useState } from 'react';
import type { AxiosError } from 'axios';
import { useAdminDepositDetail, useProcessManualRefund } from '../../../services/admin.service';
import { useUiStore } from '../../../stores/ui.store';

interface RefundQRModalProps {
  depositId: number;
  onClose: () => void;
  onRefundProcessed: () => void;
}

const RefundQRModal = React.memo(function RefundQRModal({
  depositId,
  onClose,
  onRefundProcessed,
}: RefundQRModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Map bank names to VietQR bank codes
  const getBankCode = (bankName: string | null): string => {
    if (!bankName) return '';
    const name = bankName.toLowerCase();
    
    // Check specific bank names first before checking abbreviations to avoid false matches
    if (name.includes('vietcombank') || name.includes('vcb')) return 'VCB';
    if (name.includes('techcombank') || name.includes('tcb')) return 'TCB';
    if (name.includes('vietinbank') || name.includes('ctg')) return 'CTG';
    if (name.includes('agribank')) return 'AGR';
    if (name.includes('sacombank') || name.includes('stb')) return 'STB';
    if (name.includes('mbbank') || name.includes('mb')) return 'MB';
    if (name.includes('vpbank') || name.includes('vpb')) return 'VPB';
    if (name.includes('tpbank') || name.includes('tpb')) return 'TPB';
    if (name.includes('hdbank') || name.includes('hdb')) return 'HDB';
    if (name.includes('seabank') || name.includes('seab')) return 'SEAB';
    if (name.includes('bidv')) return 'BIDV';
    if (name.includes('acb')) return 'ACB';
    if (name.includes('vib')) return 'VIB';
    if (name.includes('ocb')) return 'OCB';
    if (name.includes('shb')) return 'SHB';
    
    return 'VCB';
  };

  const buildQRUrl = (): string => {
    if (!deposit) return '';
    
    const bankCode = getBankCode(deposit.bankName);
    const accountNumber = deposit.bankAccountNumber || '';
    const amount = deposit.amount;
    const description = `Refund deposit auction ${deposit.auctionId}`;
    
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}`;
  };

  const handleConfirmTransfer = () => {
    const confirmed = window.confirm(
      `Confirm that you have transferred ${formatCurrency(deposit!.amount)} to ${deposit!.userFullName}?\n\nThis will mark the deposit as refunded and notify the user.`
    );

    if (!confirmed) return;

    setIsProcessing(true);
    processRefund(
      { depositId, reason: 'Manual refund by admin - deposit refunded via bank transfer' },
      {
        onSuccess: () => {
          showToast('Refund processed successfully. User has been notified.', 'success');
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
        </div>
      </div>
    );
  }

  if (!deposit) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-[13px] text-[#737373]">Deposit not found</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 px-4 py-2 text-[13px] font-medium rounded-lg border border-[#e6e6e6] bg-white text-[#121212] hover:bg-[#f4f4f4]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const hasBankInfo = deposit.bankName && deposit.bankAccountNumber;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-[#e6e6e6] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-[17px] font-bold text-[#121212]">
            Process Refund
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#e6e6e6] flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#f4f4f4] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {hasBankInfo ? (
            <>
              <div className="mb-6 p-4 bg-[#f9fafb] rounded-lg border border-[#e6e6e6]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                    User Details
                  </p>
                </div>
                <p className="text-[13px] font-semibold text-[#121212] mb-1">
                  {deposit.userFullName}
                </p>
                <p className="text-[11px] text-[#737373]">{deposit.userEmail}</p>
              </div>

              <div className="p-6 bg-white border-2 border-[#ad93e6] rounded-lg mb-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="overflow-hidden rounded-xl border border-[#e6e6e6]">
                    {qrError ? (
                      <div className="flex h-[220px] w-[220px] items-center justify-center bg-[#f9f9f9] p-3 text-center text-[11px] text-[#737373]">
                        QR unavailable — use account details to transfer manually.
                      </div>
                    ) : (
                      <img
                        src={buildQRUrl()}
                        alt="VietQR Code"
                        width={220}
                        height={220}
                        className="block"
                        onError={() => setQrError(true)}
                      />
                    )}
                  </div>
                  <div className="text-center w-full space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">
                      Transfer to
                    </p>
                    <div className="space-y-1.5 bg-[#f9fafb] p-3 rounded-lg">
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
                    </div>
                    <p className="text-[16px] text-[#7c5ac4] font-bold mt-3 pt-2 border-t border-[#e6e6e6]">
                      {formatCurrency(deposit.amount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-[11px] text-amber-800">
                  💡 Scan the QR code with your banking app to auto-fill transfer details, then confirm below after transfer is complete.
                </p>
              </div>
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-[12px] text-red-800 font-medium mb-2">
                ⚠️ Cannot process refund
              </p>
              <p className="text-[11px] text-red-700">
                User has not provided bank information yet. Please contact the user directly to obtain their bank details.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#e6e6e6] px-6 py-4 bg-[#f9fafb] flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[#e6e6e6] bg-white text-[#121212] hover:bg-[#f4f4f4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmTransfer}
            disabled={isProcessing || !hasBankInfo}
            className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={!hasBankInfo ? 'User must provide bank information first' : ''}
          >
            {isProcessing ? 'Processing...' : 'Confirm Transfer Complete'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default RefundQRModal;
