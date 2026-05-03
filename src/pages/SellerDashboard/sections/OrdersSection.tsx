import React, { useMemo, useState } from 'react';
import type { Order, OrderStatus } from '../../../types/seller';
import { useSellerDashboard } from '../../../services/seller.service';
import OrdersTable from '../OrdersTable';
import SellerTopbar from '../SellerTopbar';

type ChipFilter = 'all' | OrderStatus;

interface Chip {
  id: ChipFilter;
  label: string;
  count: number;
}

const OrdersSection = React.memo(function OrdersSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  const [filter, setFilter] = useState<ChipFilter>('all');

  const chips: Chip[] = useMemo(() => [
    { id: 'all',        label: 'All',        count: data.orders.length },
    { id: 'processing', label: 'Processing', count: data.orders.filter((o: Order) => o.status === 'processing').length },
    { id: 'shipped',    label: 'Shipped',    count: data.orders.filter((o: Order) => o.status === 'shipped').length    },
    { id: 'delivered',  label: 'Delivered',  count: data.orders.filter((o: Order) => o.status === 'delivered').length  },
  ], [data.orders]);

  const filtered = useMemo(() => {
    if (filter === 'all') return data.orders;
    return data.orders.filter((o: Order) => o.status === filter);
  }, [data.orders, filter]);

  return (
    <div>
      <SellerTopbar title="Orders" sub="Process and ship customer orders" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Orders</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Manage fulfillment &amp; shipping</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`h-9 px-[14px] rounded-full border text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
                  filter === chip.id
                    ? 'bg-[#ad93e6] border-[#ad93e6] text-white'
                    : 'border-[#e6e6e6] bg-white text-[#121212] hover:border-[#ad93e6] hover:text-[#ad93e6]'
                }`}
              >
                {chip.label}
                <span className="text-[11px] opacity-70">{chip.count}</span>
              </button>
            ))}
          </div>
        </div>
        <OrdersTable orders={filtered} />
      </div>
    </div>
  );
});

export default OrdersSection;
