import { useEffect, type ReactNode } from 'react';
import { useRelistAuctionForm } from '../../features/seller/useAuctionForm';
import type { SellerAuction } from '../../types/seller';
import { formatCurrency } from '../../utils/formatters';

interface RelistAuctionModalProps {
  auction: SellerAuction;
  onClose: () => void;
}

const inputCls =
  'h-10 w-full rounded-lg border border-[#e6e6e6] bg-white px-3 text-[14px] text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]';

function Field({ label, error, children }: { label: string; error?: { message?: string }; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#737373]">{label}</span>
      {children}
      {error?.message && <span className="text-[11px] text-[#ef4343]">{error.message}</span>}
    </label>
  );
}

function RelistAuctionModal({ auction, onClose }: RelistAuctionModalProps) {
  const { register, onSubmit, errors, isPending } = useRelistAuctionForm({ auction, onSuccess: onClose });

  const floorPrice = auction.floorPrice;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="relist-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e6e6e6] px-6 py-5">
          <div>
            <h2 id="relist-modal-title" className="text-[17px] font-bold text-[#121212]">Relist Auction</h2>
            <p className="text-[12px] text-[#737373] mt-0.5">
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#737373] transition hover:bg-[#f4f3f7] hover:text-[#121212]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Floor price (VNĐ)">
                  <div className="flex h-10 items-center rounded-lg border border-dashed border-[#e6e6e6] bg-[#f9f8fc] px-3 text-[14px] text-[#121212]">
                    {formatCurrency(floorPrice)}
                  </div>
                </Field>
                <Field label="Reserve price (VNĐ)" error={errors.reservePrice}>
                  <input type="number" min="0" className={inputCls} {...register('reservePrice')} />
                </Field>
              </div>

              <Field label="Required deposit to bid (VNĐ)" error={errors.requiredDepositAmount}>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  max={floorPrice > 0 ? floorPrice : undefined}
                  placeholder="0 = no deposit required"
                  className={inputCls}
                  {...register('requiredDepositAmount')}
                />
              </Field>

              <Field label="Ends at" error={errors.endsAt}>
                <input type="datetime-local" className={inputCls} {...register('endsAt')} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Extension (seconds)" error={errors.extensionSeconds}>
                  <input type="number" min="0" className={inputCls} {...register('extensionSeconds')} />
                </Field>
                <Field label="Trigger before end (s)" error={errors.triggerBeforeEnd}>
                  <input type="number" min="0" className={inputCls} {...register('triggerBeforeEnd')} />
                </Field>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#121212]">
                  <input type="checkbox" className="h-4 w-4 accent-[#ad93e6]" {...register('isUrgent')} />
                  Urgent listing
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#121212]">
                  <input type="checkbox" className="h-4 w-4 accent-[#ad93e6]" {...register('hasProofImage')} />
                  Has proof image
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[#e6e6e6] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-full border border-[#e6e6e6] px-5 text-[13px] font-medium text-[#737373] transition hover:bg-[#f4f3f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex h-10 items-center justify-center rounded-full bg-[#ad93e6] px-5 text-[13px] font-semibold text-white transition hover:bg-[#9d7ed9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Relisting…' : 'Relist auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RelistAuctionModal;
