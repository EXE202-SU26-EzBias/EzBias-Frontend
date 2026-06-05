import React from 'react';
import BarChart, { type BarChartDatum, type BarSeries } from '../../../components/charts/BarChart';
import { useSellerDashboard } from '../../../services/seller-dashboard.service';
import type { SellerDashboardResponse } from '../../../types/seller-dashboard';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

// ==================== KPI Card ====================

type AccentColor = 'purple' | 'green' | 'amber' | 'blue';

const ACCENT_CLS: Record<AccentColor, string> = {
  purple: 'bg-[rgba(173,147,230,0.1)] text-[#ad93e6] border border-[rgba(173,147,230,0.2)]',
  green: 'bg-[rgba(34,197,94,0.08)] text-[#22c55e] border border-[rgba(34,197,94,0.2)]',
  amber: 'bg-[rgba(245,158,11,0.08)] text-[#d97706] border border-[rgba(245,158,11,0.2)]',
  blue: 'bg-[rgba(59,130,246,0.08)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]',
};

function KpiCard({ label, value, sub, icon, accent = 'purple' }: { label: string; value: string; sub?: string; icon: React.ReactNode; accent?: AccentColor }) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-[0.6px]">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ACCENT_CLS[accent]}`}>{icon}</div>
      </div>
      <div className="font-bold text-[24px] tracking-[-0.8px] text-[#121212] leading-none mb-1.5 truncate">{value}</div>
      {sub && <div className="text-[11px] text-[#737373]">{sub}</div>}
    </div>
  );
}

// ==================== Skeleton ====================

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 animate-pulse">
            <div className="h-3 w-20 bg-[#e9e9e9] rounded mb-3" />
            <div className="h-7 w-28 bg-[#e9e9e9] rounded mb-2" />
            <div className="h-2.5 w-16 bg-[#e9e9e9] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 animate-pulse">
        <div className="h-4 w-40 bg-[#e9e9e9] rounded mb-6" />
        <div className="h-[260px] bg-[#f3f4f6] rounded" />
      </div>
    </div>
  );
}

// ==================== Content ====================

const REVENUE_SERIES: BarSeries[] = [
  { key: 'gross', label: 'Gross revenue', color: '#ad93e6' },
  { key: 'net', label: 'Your earnings (net)', color: '#22c55e' },
];

const OverviewContent = React.memo(function OverviewContent({ data }: { data: SellerDashboardResponse }) {
  const revenueData: BarChartDatum[] = data.monthlySales.map((m) => ({
    label: m.label.split(' ')[0],
    fullLabel: m.label,
    values: { gross: m.grossRevenue, net: m.netRevenue },
  }));

  const itemsData: BarChartDatum[] = data.monthlySales.map((m) => ({
    label: m.label.split(' ')[0],
    fullLabel: m.label,
    values: { items: m.itemsSold },
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Items sold" value={data.itemsSold.toLocaleString()} sub={`${data.completedOrders.toLocaleString()} completed orders`} icon={Icons.bag} accent="blue" />
        <KpiCard label="Gross revenue" value={formatCurrency(data.grossRevenue)} sub={`${data.totalOrders.toLocaleString()} total orders`} icon={Icons.spark} accent="purple" />
        <KpiCard label="Your earnings" value={formatCurrency(data.netRevenue)} sub={`After ${formatCurrency(data.commissionPaid)} commission`} icon={Icons.wallet} accent="green" />
        <KpiCard label="Avg rating" value={data.totalRatings > 0 ? data.avgRating.toFixed(1) : '—'} sub={`${data.totalRatings.toLocaleString()} ratings`} icon={Icons.star} accent="amber" />
      </div>

      {/* Revenue trend */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Revenue (last 12 months)</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">Gross sales vs. your net earnings after the 8% platform commission</p>
        </div>
        <BarChart data={revenueData} series={REVENUE_SERIES} formatValue={formatCurrency} formatTick={formatCurrencyCompact} ariaLabel="Monthly revenue bar chart" />
      </div>

      {/* Items sold trend */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Items sold (last 12 months)</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">Units sold per month across all your paid orders</p>
        </div>
        <BarChart
          data={itemsData}
          series={[{ key: 'items', label: 'Items sold', color: '#3b82f6' }]}
          formatValue={(n) => n.toLocaleString()}
          formatTick={(n) => n.toLocaleString()}
          showLegend={false}
          ariaLabel="Monthly items sold bar chart"
        />
      </div>
    </div>
  );
});

// ==================== Root ====================

const OverviewSection = React.memo(function OverviewSection() {
  const { data, isLoading, isError, refetch } = useSellerDashboard();

  return (
    <div>
      <SellerTopbar title="Overview" sub="How your store is performing right now" />

      {isLoading && <OverviewSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-[15px] font-semibold text-[#121212]">Failed to load your dashboard</p>
          <p className="text-[13px] text-[#737373]">Please check your connection and try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-1 text-[13px] font-medium px-5 h-9 rounded-full border border-[#e6e6e6] bg-white text-[#737373] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && data && <OverviewContent data={data} />}
    </div>
  );
});

export default OverviewSection;
