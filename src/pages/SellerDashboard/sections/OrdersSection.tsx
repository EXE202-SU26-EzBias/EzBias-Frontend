import React, { useCallback, useState } from 'react';
import { useConfirmOrder, useOrders } from '../../../services/order.service';
import { useSellerOrders, useShipSellerOrder } from '../../../services/seller-order.service';
import { useUiStore } from '../../../stores/ui.store';
import type { SellerOrder } from '../../../types/seller';
import OrdersTable from '../OrdersTable';
import SellerTopbar from '../SellerTopbar';

type Tab = 'selling' | 'buying';

const OrdersSection = React.memo(function OrdersSection() {
  const [tab, setTab] = useState<Tab>('selling');
  const [shipTarget, setShipTarget] = useState<number | null>(null);
  const [carrier, setCarrier] = useState('');
  const showToast = useUiStore((s) => s.showToast);

  const { data: sellerOrders = [], isLoading: sellerLoading, isError: sellerError } = useSellerOrders();
  const { data: buyerOrders = [], isLoading: buyerLoading, isError: buyerError } = useOrders();
  const { mutate: shipOrder, isPending: shipping } = useShipSellerOrder();
  const { mutate: confirmOrder, isPending: confirmPending, variables: confirmingOrderId } = useConfirmOrder();

  const handleShipConfirm = useCallback(() => {
    if (shipTarget === null || !carrier.trim()) return;
    shipOrder(
      { orderId: shipTarget, carrier: carrier.trim() },
      {
        onSuccess: () => { setShipTarget(null); setCarrier(''); },
        onError: () => showToast('Failed to mark as shipped.'),
      },
    );
  }, [shipTarget, carrier, shipOrder, showToast]);

  const handleConfirm = useCallback(
    (orderId: number) => {
      confirmOrder(orderId, {
        onError: () => showToast('Failed to confirm order.'),
      });
    },
    [confirmOrder, showToast],
  );

  const confirmingId = confirmPending ? confirmingOrderId : undefined;

  const isLoading = tab === 'selling' ? sellerLoading : buyerLoading;
  const isError   = tab === 'selling' ? sellerError   : buyerError;
  const orders    = (tab === 'selling' ? sellerOrders : buyerOrders) as SellerOrder[];

  return (
    <div>
      <SellerTopbar title="Orders" sub="Process and ship customer orders" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center gap-1 px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)]">
          {(['selling', 'buying'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${
                tab === t
                  ? 'bg-[#ad93e6] text-white'
                  : 'text-[#737373] hover:bg-[rgba(173,147,230,0.1)] hover:text-[#121212]'
              }`}
            >
              {t === 'selling' ? 'Selling' : 'Buying'}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
          </div>
        )}

        {isError && !isLoading && (
          <p className="px-5 py-6 text-[14px] text-[#ef4343]">Failed to load orders. Please try again.</p>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <p className="px-5 py-12 text-center text-[14px] text-[#737373]">No orders yet.</p>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <OrdersTable
            key={tab}
            orders={orders}
            mode={tab}
            onShip={setShipTarget}
            onConfirm={handleConfirm}
            confirmingId={confirmingId}
          />
        )}
      </div>

      {shipTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-[#121212]">Mark as Shipped</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#737373]">Carrier name</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. GHN, GHTK, ViettelPost"
                className="h-9 rounded-lg border border-[#e6e6e6] px-3 text-[13px] text-[#121212] outline-none focus:border-[#ad93e6]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShipTarget(null); setCarrier(''); }}
                className="h-8 px-4 rounded-lg border border-[#e6e6e6] text-[13px] text-[#737373] hover:bg-[#f5f5f5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!carrier.trim() || shipping}
                onClick={handleShipConfirm}
                className="h-8 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors disabled:opacity-50"
              >
                {shipping ? 'Saving…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrdersSection;
