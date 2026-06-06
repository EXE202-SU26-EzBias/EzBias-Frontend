import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';
import type { AdminPayoutListItem } from '../../../types/admin';

interface PayoutApproveModalProps {
  payout: AdminPayoutListItem;
  isPending: boolean;
  onConfirm: (adminNote?: string) => void;
  onClose: () => void;
}

const PayoutApproveModal = React.memo(function PayoutApproveModal({
  payout,
  isPending,
  onConfirm,
  onClose,
}: PayoutApproveModalProps) {
  const [adminNote, setAdminNote] = useState('');
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
    onConfirm(adminNote.trim() || undefined);
  }, [onConfirm, adminNote]);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6e6e6]">
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
            <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wide">Amount to approve</span>
            <span className="text-[20px] font-bold text-[#7C3AED]">{formatCurrency(payout.amount)}</span>
            <span className="text-[12px] text-[#737373]">
              {payout.seller.fullName} (@{payout.seller.username}) · Order #{payout.orderId}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#737373]">
              Admin note <span className="font-normal text-[#b3b3b3]">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Leave a note for this approval..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-[#e6e6e6] px-3 py-2 text-[13px] text-[#121212] resize-none focus:outline-none focus:border-[#ad93e6] disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e6e6e6] bg-[#f9fafb] rounded-b-2xl">
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
            Approve
          </button>
        </div>
      </div>
    </div>
  );
});

export default PayoutApproveModal;
