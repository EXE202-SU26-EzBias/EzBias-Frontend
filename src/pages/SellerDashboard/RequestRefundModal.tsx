import { useRequestRefundForm } from '../../features/dispute/useRequestRefundForm';
import type { Order } from '../../types/order';

interface RequestRefundModalProps {
  order: Order;
  onClose: () => void;
}

export default function RequestRefundModal({ order, onClose }: RequestRefundModalProps) {
  const {
    checkedItems,
    quantities,
    reason,
    setReason,
    toggleItem,
    setQuantity,
    handleSubmit,
    isPending,
    canSubmit,
  } = useRequestRefundForm({ order, onSuccess: onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refund-modal-title"
        className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 id="refund-modal-title" className="text-[15px] font-bold text-[#121212]">Request Refund</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e6e6e6] text-[#737373] hover:text-[#121212] transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-medium text-[#737373]">Select items to dispute</p>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => {
              const checked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]"
                >
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={checked}
                    onChange={() => toggleItem(item.id)}
                    className="accent-[#ad93e6] w-4 h-4 shrink-0"
                  />
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-9 w-9 rounded object-cover shrink-0"
                    />
                  )}
                  <label htmlFor={`item-${item.id}`} className="flex-1 text-[13px] text-[#121212] cursor-pointer">
                    {item.productName}
                    <span className="text-[#737373] ml-1">(×{item.quantity})</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#737373]">Qty:</span>
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      disabled={!checked}
                      value={checked ? (quantities[item.id] ?? 1) : 1}
                      onChange={(e) => setQuantity(item.id, Math.max(1, Math.min(item.quantity, Number(e.target.value))))}
                      className="w-14 h-7 rounded border border-[#e6e6e6] px-2 text-[12px] text-[#121212] outline-none focus:border-[#ad93e6] disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-[#737373]">Reason for dispute</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue with your order…"
            className="rounded-lg border border-[#e6e6e6] px-3 py-2 text-[13px] text-[#121212] outline-none focus:border-[#ad93e6] resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-lg border border-[#e6e6e6] text-[13px] text-[#737373] hover:bg-[#f5f5f5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={handleSubmit}
            className="h-8 px-4 rounded-lg border border-[#c2410c] text-[#c2410c] text-[13px] font-semibold hover:bg-[#fff7ed] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Submitting…' : 'Submit Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
}
