import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { getOrderStatusColors, getOrderStatusLabel } from '../../constants/order';
import { useStartConversation } from '../../services/chat.service';
import { useAddAuctionToCart } from '../../services/cart.service';
import { useUiStore } from '../../stores/ui.store';
import type { SellerOrder } from '../../types/seller';
import type { Conversation } from '../../types/chat';
import ChatPanel from '../../components/chat/ChatPanel';
import { formatCurrency } from '../../utils/formatters';
import { parseAddressSnap } from '../../utils/parseAddressSnap';

interface OrdersTableProps {
  orders: SellerOrder[];
  mode: 'selling' | 'buying';
  onShip?: (orderId: number) => void;
  onConfirm?: (orderId: number) => void;
  confirmingId?: number;
  onRequestRefund?: (order: SellerOrder) => void;
}

function itemsSummary(items: SellerOrder['items']): string {
  if (!items.length) return '—';
  const first = items[0].productName;
  return items.length > 1 ? `${first} +${items.length - 1} more` : first;
}

const HEADERS_SELLING = ['Order', 'Buyer', 'Items', 'Total', 'Status', 'Action'];
const HEADERS_BUYING = ['Order', 'Seller', 'Items', 'Total', 'Status', 'Action'];

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ShipToBlock({ addressSnap }: { addressSnap: string }) {
  const a = parseAddressSnap(addressSnap);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] mb-1">Ship to</p>
      <p className="text-[13px] font-semibold text-[#121212]">{a.name}</p>
      <p className="text-[12px] text-[#737373]">{a.phone}</p>
      <p className="text-[12px] text-[#737373]">
        {a.address}, {a.city} {a.zip}
      </p>
    </div>
  );
}

function SellingModeAction({ order, onShip }: { order: SellerOrder; onShip?: (id: number) => void }) {
  if (order.status === 2 || order.status === 3) {
    return (
      <button
        type="button"
        onClick={() => onShip?.(order.id)}
        className="h-7 px-3 rounded-lg bg-[#ad93e6] text-white text-[12px] font-semibold hover:bg-[#9d7ed9] transition-colors"
      >
        Ship
      </button>
    );
  }
  if (order.carrier) {
    return <span className="text-[#737373] text-[12px]">{order.carrier}</span>;
  }
  return null;
}

function PayNowButton({ order }: { order?: any }) {
  const navigate = useNavigate();
  const showToast = useUiStore((s) => s.showToast);
  const addAuctionToCart = useAddAuctionToCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    // If this is an auction order, add to cart first then navigate to checkout
    if (order?.auctionId) {
      setIsProcessing(true);
      try {
        await addAuctionToCart.mutateAsync(order.auctionId);
        navigate('/checkout');
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Failed to prepare checkout', 'error');
        setIsProcessing(false);
      }
      return;
    }

    // For regular cart orders, navigate directly to checkout
    navigate('/checkout');
  };

  return (
    <button
      type="button"
      disabled={isProcessing}
      onClick={handlePay}
      className="inline-flex h-7 items-center rounded-lg border border-amber-300 bg-amber-50 px-3 text-[12px] font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
    >
      {isProcessing ? '…' : 'Pay Now'}
    </button>
  );
}

function MessageSellerButton({ sellerId, orderId }: { sellerId: number; orderId: number }) {
  const [chatConv, setChatConv] = useState<Conversation | null>(null);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: startConversation, isPending } = useStartConversation();

  const handleClick = () => {
    startConversation(
      { counterpartId: sellerId, orderId },
      {
        onSuccess: (conv) => setChatConv(conv),
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message
            ?? 'Could not open chat.';
          showToast(message, 'error');
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={handleClick}
        className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#e6e6e6] bg-white px-2.5 text-[11px] font-semibold text-[#737373] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-colors disabled:opacity-50"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {isPending ? '…' : 'Message'}
      </button>
      {chatConv && createPortal(
        <ChatPanel conversation={chatConv} onClose={() => setChatConv(null)} />,
        document.body
      )}
    </>
  );
}

function BuyingModeAction({
  order,
  confirmingId,
  onConfirm,
  onRequestRefund,
}: {
  order: SellerOrder;
  confirmingId?: number;
  onConfirm?: (id: number) => void;
  onRequestRefund?: (order: SellerOrder) => void;
}) {
  // Message button is always available for active buying orders
  const msgBtn = order.status < 8
    ? <MessageSellerButton sellerId={order.sellerId} orderId={order.id} />
    : null;

  if (order.status === 1 && order.paymentId) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Link
          to={`/payment/${order.paymentId}`}
          className="inline-flex h-7 items-center rounded-lg border border-amber-300 bg-amber-50 px-3 text-[12px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
        >
          Pay Now
        </Link>
        {msgBtn}
      </div>
    );
  }
  if (order.status === 1 && !order.paymentId) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <PayNowButton order={order} />
        {msgBtn}
      </div>
    );
  }
  if (order.status === 4) {
    const confirming = confirmingId === order.id;
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          disabled={confirming}
          onClick={() => onConfirm?.(order.id)}
          className="h-7 px-3 rounded-lg border border-[#ad93e6] text-[#7c5ac4] text-[12px] font-semibold hover:bg-[rgba(173,147,230,0.1)] transition-colors disabled:opacity-50"
        >
          {confirming ? '…' : 'Confirm'}
        </button>
        {msgBtn}
      </div>
    );
  }
  if (order.status === 5) {
    const wasRejected = order.dispute?.status === 'ResolvedSeller';
    const rejectionNote = wasRejected ? order.dispute?.adminNote ?? null : null;
    return (
      <div className="flex flex-col items-start gap-1.5">
        {rejectionNote && (
          <span className="inline-flex items-start gap-1 max-w-[260px] text-[11px] text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-2 py-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>Refund rejected: {rejectionNote}</span>
          </span>
        )}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onRequestRefund?.(order)}
            className="h-8 px-3 rounded-lg border border-[#c2410c] text-[#c2410c] text-[12px] font-semibold hover:bg-[#fff7ed] transition-colors whitespace-nowrap"
          >
            {wasRejected ? 'Request Refund Again' : 'Request Refund'}
          </button>
          {msgBtn}
        </div>
      </div>
    );
  }
  if (order.status === 6) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[12px] text-[#c2410c] font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Dispute pending
        </span>
        {msgBtn}
      </div>
    );
  }
  if (order.status === 9) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-[#166534] font-medium">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-5" />
        </svg>
        Refunded
      </span>
    );
  }
  if (order.carrier && order.status <= 5) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[#737373] text-[12px]">
          {order.carrier}
          {order.trackingNumber && ` · ${order.trackingNumber}`}
        </span>
        {msgBtn}
      </div>
    );
  }
  return msgBtn;
}

const OrdersTable = React.memo(function OrdersTable({
  orders,
  mode,
  onShip,
  onConfirm,
  confirmingId,
  onRequestRefund,
}: OrdersTableProps) {
  const headers = mode === 'selling' ? HEADERS_SELLING : HEADERS_BUYING;
  const colSpan = headers.length;
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const statusCls = getOrderStatusColors(o.status);
            const counterpart = mode === 'selling' ? o.user.fullName : o.seller.fullName;
            const isExpanded = expandedId === o.id;

            const action =
              mode === 'selling' ? (
                <SellingModeAction order={o} onShip={onShip} />
              ) : (
                <BuyingModeAction
                  order={o}
                  confirmingId={confirmingId}
                  onConfirm={onConfirm}
                  onRequestRefund={onRequestRefund}
                />
              );

            const itemsCell = (
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : o.id)}
                className="flex items-center gap-1.5 text-[#737373] hover:text-[#121212] transition-colors text-left"
              >
                <span className="truncate max-w-[160px]">{itemsSummary(o.items)}</span>
                {o.items.length > 0 && <ChevronDown open={isExpanded} />}
              </button>
            );

            return (
              <React.Fragment key={o.id}>
                <tr className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)]">
                  <td className="px-4 py-[14px] text-[#121212] align-middle font-medium">#{o.id}</td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">{counterpart}</td>
                  <td className="px-4 py-[14px] align-middle">{itemsCell}</td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle font-semibold">
                    {formatCurrency(o.total)}
                    {o.source === 2 && (
                      <div className="text-[10px] text-[#16a34a] font-normal mt-0.5">
                        (Deposit will be deducted at payment)
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-[14px] align-middle">
                    <span
                      className={`inline-flex items-center px-[10px] py-0.5 rounded-full text-[11px] font-semibold border ${statusCls}`}
                    >
                      {getOrderStatusLabel(o.status)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] align-middle">{action}</td>
                </tr>
                {isExpanded && (
                  <tr className="bg-[rgba(244,243,247,0.6)] border-b border-[rgba(230,230,230,0.5)]">
                    <td colSpan={colSpan} className="px-6 py-4">
                      <div className="flex flex-col gap-4">
                        {mode === 'selling' && <ShipToBlock addressSnap={o.addressSnap} />}
                        <table className="w-full text-[12px]">
                          <thead>
                            <tr>
                              {['Product', 'Qty', 'Unit price', 'Subtotal'].map((h) => (
                                <th key={h} className="text-left font-semibold text-[#737373] pb-2 pr-6">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-1.5 pr-6 text-[#121212]">
                                  <div className="flex items-center gap-2">
                                    {item.productImage && (
                                      <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="h-8 w-8 rounded object-cover shrink-0"
                                      />
                                    )}
                                    <span>{item.productName}</span>
                                  </div>
                                </td>
                                <td className="py-1.5 pr-6 text-[#737373]">{item.quantity}</td>
                                <td className="py-1.5 pr-6 text-[#737373]">{formatCurrency(item.unitPrice)}</td>
                                <td className="py-1.5 text-[#121212] font-medium">{formatCurrency(item.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default OrdersTable;
