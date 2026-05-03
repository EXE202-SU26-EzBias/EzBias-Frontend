import React, { useMemo } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import KpiCard from '../../SellerDashboard/KpiCard';
import RevenueChart from '../../SellerDashboard/RevenueChart';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import { formatCurrency } from '../../../utils/formatters';
import type { SellerVerifyStatus } from '../../../types/admin';

const statusBadge: Record<SellerVerifyStatus, string> = {
  active:    'bg-[#f0fdf4] text-[#166534]',
  pending:   'bg-[#fff7ed] text-[#b45309]',
  suspended: 'bg-[#fef2f2] text-[#ef4343]',
};

const AnalyticsSection = React.memo(function AnalyticsSection() {
  const { data } = useAdminDashboard();

  const topSellers = useMemo(
    () => [...(data?.sellers ?? [])].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    [data],
  );

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Analytics" sub="Platform trends, top sellers, top products" />

      <div className="grid grid-cols-4 gap-4 mb-6 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Revenue trend</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Platform GMV over time</p>
          </div>
        </div>
        <div className="p-5">
          <RevenueChart data={data.chart} />
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Top sellers</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Ranked by revenue</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Rank', 'Seller', 'Revenue', 'Listings', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topSellers.map((seller, idx) => (
                <tr key={seller.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#7c3aed] align-middle text-[13px] font-bold">
                    #{idx + 1}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px] font-medium">
                    <div>
                      <p className="font-semibold text-[#121212] m-0">{seller.name}</p>
                      <p className="text-[11px] text-[#737373] m-0">{seller.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px] font-semibold">
                    {seller.revenue > 0 ? formatCurrency(seller.revenue) : '—'}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px]">
                    {seller.listings}
                  </td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[seller.status]}`}>
                      {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default AnalyticsSection;
