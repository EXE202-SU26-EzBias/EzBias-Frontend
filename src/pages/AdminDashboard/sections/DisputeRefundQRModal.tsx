import React, { useMemo, useState } from 'react';
import type { AxiosError } from 'axios';
import { useRefundPayment } from '../../../services/dispute.service';
import { useUiStore } from '../../../stores/ui.store';
import type { DisputeResponse } from '../../../types/dispute';
import { formatCurrency } from '../../../utils/formatters';
import { buildVietQrUrl } from '../../../utils/vietqr';

interface DisputeRefundQRModalProps {
  dispute: DisputeResponse;
  onClose: () => void;
  onProcessed: () => void;
}

const DisputeRefundQRModal = React.memo(function DisputeRefundQRModal({
  dispute,
  onClose,
  onProcessed,
}: DisputeRefundQRModalProps) {
  const [qrError, setQrError] = useState(false);

  const { mutate: refund, isPending: isProcessing } = useRefundPayment();
  const showToast = useUiStore((s) => s.showToast);

  const info = dispute.refundPayoutInfo;

  const refundAmount = useMemo(
    () => dispute.items.reduce((sum, item) => sum + (item.approvedQty ?? 0) * item.unitPrice, 0),
    [dispute.items],
  );

  const hasBankInfo = !!(info?.bankName && info?.bankAccountNumber);

  const qrUrl = useMemo(
    () =>
      buildVietQrUrl({
        bankName: info?.bankName ?? null,
        accountNumber: info?.bankAccountNumber ?? null,
        amount: refundAmount,
        addInfo: `Refund dispute ${dispute.id}`,
      }),
    [info?.bankName, info?.bankAccountNumber, refundAmount, dispute.id],
  );

  const handleConfirmTransfer = () => {
    const confirmed = window.confirm(
      `Confirm that you have transferred ${formatCurrency(refundAmount)} to ${info?.buyerFullName ?? 'the buyer'}?\n\nThis will mark the refund as processed and notify the buyer.`,
    );
    if (!confirmed) return;

    refund(dispute.id, {
      onSuccess: () => {
        showToast('Refund processed. Buyer notified.', 'success');
        onProcessed();
      },
      onError: (err) => {
        const message =
          (err as AxiosError<{ message?: string }>).response?.data?.message ??
          'Failed to process refund. Please try again.';
        showToast(message, 'error');
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="sticky top-0 bg-white border-b border-[#e6e6e6] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-[17px] font-bold text-[#121212]">Process Refund</h2>
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
                    Buyer Details
                  </p>
                </div>
                <p className="text-[13px] font-semibold text-[#121212] mb-1">{info?.buyerFullName}</p>
                <p className="text-[11px] text-[#737373]">{info?.buyerEmail}</p>
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
                        src={qrUrl}
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
                        <span className="font-medium">{info?.bankName}</span>
                      </p>
                      <p className="text-[12px] text-[#121212]">
                        <span className="font-semibold text-[#737373]">Account:</span>{' '}
                        <span className="font-mono font-medium">{info?.bankAccountNumber}</span>
                      </p>
                      <p className="text-[12px] text-[#121212]">
                        <span className="font-semibold text-[#737373]">Name:</span>{' '}
                        <span className="font-medium">{info?.bankAccountName || info?.buyerFullName}</span>
                      </p>
                    </div>
                    <p className="text-[16px] text-[#7c5ac4] font-bold mt-3 pt-2 border-t border-[#e6e6e6]">
                      {formatCurrency(refundAmount)}
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
              <p className="text-[12px] text-red-800 font-medium mb-2">⚠️ Cannot process refund</p>
              <p className="text-[11px] text-red-700">
                Buyer has not provided bank information yet. Please contact the buyer directly to obtain their bank details.
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
            title={!hasBankInfo ? 'Buyer must provide bank information first' : ''}
          >
            {isProcessing ? 'Processing...' : 'Confirm Transfer Complete'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default DisputeRefundQRModal;
