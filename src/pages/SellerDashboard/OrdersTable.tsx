import React from 'react';
import type { Order, OrderStatus } from '../../types/seller';
import { fmt } from './sellerMockData';

interface OrdersTableProps {
  orders: Order[];
}

const statusBadge: Record<OrderStatus, string> = {
  processing: 'bg-[#fff7ed] text-[#b45309]',
  shipped:    'bg-[#eff6ff] text-[#1d4ed8]',
  delivered:  'bg-[#f0fdf4] text-[#166534]',
};

const statusLabel: Record<OrderStatus, string> = {
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
};

const OrdersTable = React.memo(function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['Order', 'Item', 'Buyer', 'Total', 'Status'].map((h) => (
              <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={o.id} className="hover:bg-[rgba(173,147,230,0.05)]">
              <td className={`px-4 py-[14px] text-[#121212] align-middle font-medium ${idx < orders.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {o.id}
              </td>
              <td className={`px-4 py-[14px] text-[#121212] align-middle ${idx < orders.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {o.item}
              </td>
              <td className={`px-4 py-[14px] text-[#737373] align-middle ${idx < orders.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {o.buyer}
              </td>
              <td className={`px-4 py-[14px] text-[#121212] align-middle font-semibold ${idx < orders.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {fmt(o.total)}
              </td>
              <td className={`px-4 py-[14px] align-middle ${idx < orders.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[o.status]}`}>
                  {statusLabel[o.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default OrdersTable;
