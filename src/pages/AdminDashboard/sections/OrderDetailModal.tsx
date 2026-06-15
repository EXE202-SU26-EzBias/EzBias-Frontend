import React from 'react';
import { useAdminOrderDetail } from '../../../services/admin.service';
import { getOrderStatusColors, getOrderStatusLabel } from '../../../constants/order';
import { formatCurrency } from '../../../utils/formatters';
import { parseAddressSnap } from '../../../utils/parseAddressSnap';

interface OrderDetailModalProps {
  orderId: number;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#737373] mb-1">{label}</p>
    <div className="text-[13px] text-[#121212]">{children}</div>
  </div>
);

const OrderDetailModal = React.memo(function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useAdminOrderDetail(orderId);
  const addr = order ? parseAddressSnap(order.addressSnap) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#e6e6e6] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-[17px] font-bold text-[#121212]">Order Details #{orderId}</h2>
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
        ) : order ? (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Field label="Status">
                <span
                  className={`inline-flex items-center px-[10px] py-0.5 rounded-full text-[11px] font-semibold border ${getOrderStatusColors(order.status)}`}
                >
                  {getOrderStatusLabel(order.status)}
                </span>
              </Field>
              <Field label="Total">
                <span className="text-[15px] font-bold">{formatCurrency(order.total)}</span>
              </Field>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6 mb-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">Parties</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Buyer">
                  <p className="font-medium">{order.user?.fullName ?? '—'}</p>
                  <p className="text-[11px] text-[#737373]">@{order.user?.username ?? '—'} · #{order.userId}</p>
                </Field>
                <Field label="Seller">
                  <p className="font-medium">{order.seller?.fullName ?? '—'}</p>
                  <p className="text-[11px] text-[#737373]">@{order.seller?.username ?? '—'} · #{order.sellerId}</p>
                </Field>
              </div>
            </div>

            <div className="border-t border-[#e6e6e6] pt-6 mb-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">Order Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Source">{order.source === 2 ? 'Auction' : 'Cart'}</Field>
                <Field label="Auction ID">{order.auctionId ? `#${order.auctionId}` : '—'}</Field>
                <Field label="Payment ID">{order.paymentId ? `#${order.paymentId}` : '—'}</Field>
                <Field label="Carrier">
                  {order.carrier ? `${order.carrier}${order.trackingNumber ? ` · ${order.trackingNumber}` : ''}` : '—'}
                </Field>
                <Field label="Created At">
                  <span className="text-[#737373]">{formatDate(order.createdAt)}</span>
                </Field>
                <Field label="Delivered At">
                  <span className="text-[#737373]">{order.deliveredAt ? formatDate(order.deliveredAt) : '—'}</span>
                </Field>
              </div>
            </div>

            {addr && (
              <div className="border-t border-[#e6e6e6] pt-6 mb-6">
                <h3 className="text-[13px] font-bold text-[#121212] mb-4">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name">{addr.name}</Field>
                  <Field label="Phone">{addr.phone}</Field>
                  <Field label="Address">{addr.address}</Field>
                  <Field label="City / Zip">{addr.city} {addr.zip}</Field>
                </div>
              </div>
            )}

            <div className="border-t border-[#e6e6e6] pt-6">
              <h3 className="text-[13px] font-bold text-[#121212] mb-4">Items</h3>
              <table className="w-full text-[12px]">
                <thead>
                  <tr>
                    {['Product', 'Qty', 'Unit price', 'Subtotal'].map((h) => (
                      <th key={h} className="text-left font-semibold text-[#737373] pb-2 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1.5 pr-6 text-[#121212]">
                        <div className="flex items-center gap-2">
                          {item.productImage && (
                            <img src={item.productImage} alt={item.productName} className="h-8 w-8 rounded object-cover shrink-0" />
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
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-[13px] text-[#737373]">Order not found</p>
          </div>
        )}

        <div className="border-t border-[#e6e6e6] px-6 py-4 bg-[#f9fafb] flex items-center justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[#e6e6e6] bg-white text-[#121212] hover:bg-[#f4f4f4] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

export default OrderDetailModal;
