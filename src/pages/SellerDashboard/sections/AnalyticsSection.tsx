import React, { useState } from 'react';
import type { SellerData } from '../../../types/seller';
import KpiCard from '../KpiCard';
import ListingsTable from '../ListingsTable';
import RevenueChart from '../RevenueChart';
import SellerTopbar from '../SellerTopbar';

interface AnalyticsSectionProps {
  data: SellerData;
}

const AnalyticsSection = React.memo(function AnalyticsSection({ data }: AnalyticsSectionProps) {
  const [period, setPeriod] = useState('7d');

  const topListings = [...data.listings]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

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
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none h-9 pl-3.5 pr-9 rounded-full border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium cursor-pointer focus:outline-none focus:border-[#ad93e6]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
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
