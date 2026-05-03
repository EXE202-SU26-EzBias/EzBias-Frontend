import React from 'react';
import { useSellerDashboard } from '../../../services/seller.service';
import ActivityFeed from '../ActivityFeed';
import KpiCard from '../KpiCard';
import OrdersTable from '../OrdersTable';
import RevenueChart from '../RevenueChart';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

const OverviewSection = React.memo(function OverviewSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Overview" sub="How your store is performing right now" />

      <div className="flex items-center gap-3 px-[18px] py-[14px] rounded-xl bg-[rgba(173,147,230,0.08)] border border-[rgba(173,147,230,0.20)] mb-6 text-[13px] text-[#121212]">
        <span className="text-[#ad93e6] flex-shrink-0">{Icons.info}</span>
        <span>
          Your <strong>CORTIS Pin Set</strong> listing is in draft.{' '}
          <button type="button" className="text-[#ad93e6] font-semibold hover:underline">
            Review and publish →
          </button>
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 [&]:max-[1100px]:grid-cols-2 [&]:max-[600px]:grid-cols-1">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-6 max-[1100px]:grid-cols-1">
        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
            <div>
              <h2 className="text-[16px] font-bold text-[#121212] m-0">Revenue trend</h2>
              <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Last 7 days</p>
            </div>
          </div>
          <div className="p-5">
            <RevenueChart data={data.chart} />
          </div>
        </div>

        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
            <div>
              <h2 className="text-[16px] font-bold text-[#121212] m-0">Activity</h2>
              <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Latest actions on your store</p>
            </div>
          </div>
          <div className="p-5">
            <ActivityFeed items={data.feed} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Recent orders</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Last 4 orders</p>
          </div>
        </div>
        <OrdersTable orders={data.orders.slice(0, 4)} />
      </div>
    </div>
  );
});

export default OverviewSection;
