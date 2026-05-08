import React, { useMemo, useState } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import type { OrderStatus } from '../../../types/admin';
import OrdersTable from '../../SellerDashboard/OrdersTable';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

type ChipFilter = 'all' | OrderStatus;

const OrdersSection = React.memo(function OrdersSection() {
  const { data } = useAdminDashboard();
  const [filter, setFilter] = useState<ChipFilter>('all');

  const { chips, filtered } = useMemo(() => {
    const orders = data?.orders ?? [];
    const counts = { processing: 0, shipped: 0, delivered: 0 };
    for (const o of orders) counts[o.status]++;
    return {
      chips: [
        { id: 'all'        as ChipFilter, label: 'All',        count: orders.length        },
        { id: 'processing' as ChipFilter, label: 'Processing', count: counts.processing    },
        { id: 'shipped'    as ChipFilter, label: 'Shipped',    count: counts.shipped       },
        { id: 'delivered'  as ChipFilter, label: 'Delivered',  count: counts.delivered     },
      ],
      filtered: filter === 'all' ? orders : orders.filter((o) => o.status === filter),
    };
  }, [data, filter]);

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Orders" sub="All orders across the platform" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Orders</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">All platform orders</p>
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
