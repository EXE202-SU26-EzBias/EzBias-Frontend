import React, { useMemo } from 'react';
import { useSellerDashboard } from '../../../services/seller.service';
import KpiCard from '../KpiCard';
import ListingsTable from '../ListingsTable';
import RevenueChart from '../RevenueChart';
import SellerTopbar from '../SellerTopbar';

const AnalyticsSection = React.memo(function AnalyticsSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  const topListings = useMemo(
    () => [...data.listings].sort((a, b) => b.views - a.views).slice(0, 5),
    [data.listings],
  );

  return (
    <div>
      <SellerTopbar title="Analytics" sub="Trends, top performers, conversion" />

      <div className="grid grid-cols-4 gap-4 mb-6 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Revenue trend</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Sales over time</p>
          </div>
        </div>
        <div className="p-5">
          <RevenueChart data={data.chart} />
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Top performing listings</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Ranked by views</p>
          </div>
        </div>
        <ListingsTable listings={topListings} />
      </div>
    </div>
  );
});

export default AnalyticsSection;
