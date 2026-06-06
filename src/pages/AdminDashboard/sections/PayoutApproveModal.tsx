import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';
import type { AdminPayoutListItem } from '../../../types/admin';

interface PayoutApproveModalProps {
  payout: AdminPayoutListItem;
  isPending: boolean;
  onConfirm: (bankTransferRef?: string) => void;
  onClose: () => void;
}

// Map bank names to VietQR bank codes
function getBankCode(bankName: string | null): string {
  if (!bankName) return 'VCB';
  const name = bankName.toLowerCase();

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
}

const PayoutApproveModal = React.memo(function PayoutApproveModal({
  payout,
  isPending,
  onConfirm,
  onClose,
}: PayoutApproveModalProps) {
  const [qrError, setQrError] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, isPending]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === backdropRef.current && !isPending) onClose();
    },
    [onClose, isPending],
  );

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const seller = payout.seller;
  // payout.amount is already the seller net amount (order total minus 8% commission).
  const hasBankInfo = Boolean(seller?.bankName && seller?.bankAccountNumber);

  const qrUrl = (() => {
    if (!seller || !hasBankInfo) return '';
    const bankCode = getBankCode(seller.bankName);
    const accountNumber = seller.bankAccountNumber ?? '';
    const description = `Payout order ${payout.orderId}`;
    const accountName = seller.bankAccountName || seller.fullName;
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${payout.amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  })();

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-[#e6e6e6] rounded-t-2xl">
          <h2 className="text-[17px] font-bold text-[#121212]">Approve Payout</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-8 h-8 rounded-lg border border-[#e6e6e6] flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#f4f4f4] transition-colors disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-[rgba(173,147,230,0.08)] rounded-xl border border-[rgba(173,147,230,0.2)] px-4 py-3 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wide">Amount to transfer (net of 8% fee)</span>
            <span className="text-[20px] font-bold text-[#7C3AED]">{formatCurrency(payout.amount)}</span>
            <span className="text-[12px] text-[#737373]">
              {seller?.fullName} (@{seller?.username}) · Order #{payout.orderId}
            </span>
          </div>

          {hasBankInfo ? (
            <div className="p-5 bg-white border-2 border-[#ad93e6] rounded-xl flex flex-col items-center gap-4">
              <div className="overflow-hidden rounded-xl border border-[#e6e6e6]">
                {qrError ? (
                  <div className="flex h-[220px] w-[220px] items-center justify-center bg-[#f9f9f9] p-3 text-center text-[11px] text-[#737373]">
                    QR unavailable — use account details below to transfer manually.
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
              <div className="w-full space-y-1.5 bg-[#f9fafb] p-3 rounded-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373]">Transfer to</p>
                <p className="text-[12px] text-[#121212]">
                  <span className="font-semibold text-[#737373]">Bank:</span>{' '}
                  <span className="font-medium">{seller?.bankName}</span>
                </p>
                <p className="text-[12px] text-[#121212]">
                  <span className="font-semibold text-[#737373]">Account:</span>{' '}
                  <span className="font-mono font-medium">{seller?.bankAccountNumber}</span>
                </p>
                <p className="text-[12px] text-[#121212]">
                  <span className="font-semibold text-[#737373]">Name:</span>{' '}
                  <span className="font-medium">{seller?.bankAccountName || seller?.fullName}</span>
                </p>
              </div>
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                💡 Scan the QR with your banking app to transfer, then enter the reference and confirm below.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-[12px] text-red-800 font-medium mb-1">⚠️ No bank information</p>
              <p className="text-[11px] text-red-700">
                This seller has not provided bank details yet. Contact them directly before transferring.
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e6e6e6] bg-[#f9fafb] rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-9 px-4 rounded-lg border border-[#e6e6e6] bg-white text-[13px] font-medium text-[#121212] hover:bg-[#f4f4f4] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isPending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            Confirm Transfer Complete
          </button>
        </div>
      </div>
    </div>
  );
});

export default PayoutApproveModal;
