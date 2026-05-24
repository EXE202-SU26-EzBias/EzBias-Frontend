import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrderStatusColors, getOrderStatusLabel } from '../../constants/order';
import type { SellerOrder } from '../../types/seller';
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
  if (order.status === 1 && order.paymentId) {
    return (
      <Link
        to={`/payment/${order.paymentId}`}
        className="inline-flex h-7 items-center rounded-lg border border-amber-300 bg-amber-50 px-3 text-[12px] font-semibold text-amber-700 transition-colors hover:bg-amber-100"
      >
        Pay Now
      </Link>
    );
  }
  if (order.status === 4) {
    const confirming = confirmingId === order.id;
    return (
      <button
        type="button"
        disabled={confirming}
        onClick={() => onConfirm?.(order.id)}
        className="h-7 px-3 rounded-lg border border-[#ad93e6] text-[#7c5ac4] text-[12px] font-semibold hover:bg-[rgba(173,147,230,0.1)] transition-colors disabled:opacity-50"
      >
        {confirming ? '…' : 'Confirm'}
      </button>
    );
  }
  if (order.status === 5) {
    return (
      <button
        type="button"
        onClick={() => onRequestRefund?.(order)}
        className="h-8 px-3 rounded-lg border border-[#c2410c] text-[#c2410c] text-[12px] font-semibold hover:bg-[#fff7ed] transition-colors whitespace-nowrap"
      >
        Request Refund
      </button>
    );
  }
  if (order.status === 6) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-[#c2410c] font-medium">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        Dispute pending
      </span>
    );
  }
  if (order.status === 9) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] text-[#166534] font-medium">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-5" />
        </svg>
        Refunded
      </span>
    );
  }
  if (order.carrier && order.status <= 5) {
    return (
      <span className="text-[#737373] text-[12px]">
        {order.carrier}
        {order.trackingNumber && ` · ${order.trackingNumber}`}
      </span>
    );
  }
  return null;
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
