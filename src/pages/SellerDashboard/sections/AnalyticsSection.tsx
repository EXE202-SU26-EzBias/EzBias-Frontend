import React, { useMemo } from 'react';
import BarChart, { type BarChartDatum, type BarSeries } from '../../../components/charts/BarChart';
import { useProducts } from '../../../services/product.service';
import { useSellerDashboard } from '../../../services/seller-dashboard.service';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters';
import ListingsTable from '../ListingsTable';
import SellerTopbar from '../SellerTopbar';

const TREND_SERIES: BarSeries[] = [
  { key: 'gross', label: 'Gross revenue', color: '#ad93e6' },
  { key: 'commission', label: 'Commission paid', color: '#ef4343' },
  { key: 'net', label: 'Net earnings', color: '#22c55e' },
];

const AnalyticsSection = React.memo(function AnalyticsSection() {
  const { data: products = [], isLoading } = useProducts();
  const { data: dashboard, isLoading: dashLoading, isError } = useSellerDashboard();
  const topListings = useMemo(() => products.slice(0, 5), [products]);

  const trendData: BarChartDatum[] = useMemo(
    () =>
      (dashboard?.monthlySales ?? []).map((m) => ({
        label: m.label.split(' ')[0],
        fullLabel: m.label,
        values: { gross: m.grossRevenue, commission: m.commissionPaid, net: m.netRevenue },
      })),
    [dashboard],
  );

  return (
    <div>
      <SellerTopbar title="Analytics" sub="Trends, top performers, conversion" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-[16px] font-bold text-[#121212] m-0">Revenue trends</h2>
          <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Gross sales, platform commission, and your net earnings per month</p>
        </div>
        {dashLoading && <div className="h-[260px] bg-[#f3f4f6] rounded animate-pulse" />}
        {isError && !dashLoading && <p className="py-12 text-center text-[14px] text-[#737373]">Could not load revenue trends.</p>}
        {!dashLoading && !isError && dashboard && (
          <BarChart data={trendData} series={TREND_SERIES} formatValue={formatCurrency} formatTick={formatCurrencyCompact} ariaLabel="Monthly revenue trend bar chart" />
        )}
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Top listings</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Your most recent products</p>
          </div>
        </div>
        {isLoading && <p className="px-5 py-6 text-[14px] text-[#737373]">Loading…</p>}
        {!isLoading && <ListingsTable listings={topListings} />}
      </div>
    </div>
  );
});

export default AnalyticsSection;
