import React, { useMemo } from 'react';
import BarChart, { type BarChartDatum, type BarSeries } from '../../../components/charts/BarChart';
import { useAdminDashboardOverview } from '../../../services/admin.service';
import type { AdminDashboardOverviewResponse } from '../../../types/admin';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters';
import { AdminIcons } from '../adminIcons';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

// ==================== KPI Card ====================

type AccentColor = 'purple' | 'green' | 'amber' | 'blue';

const ACCENT_CLS: Record<AccentColor, string> = {
  purple: 'bg-[rgba(173,147,230,0.1)] text-[#ad93e6] border border-[rgba(173,147,230,0.2)]',
  green:  'bg-[rgba(34,197,94,0.08)] text-[#22c55e] border border-[rgba(34,197,94,0.2)]',
  amber:  'bg-[rgba(245,158,11,0.08)] text-[#d97706] border border-[rgba(245,158,11,0.2)]',
  blue:   'bg-[rgba(59,130,246,0.08)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]',
};

function KpiCard({ label, value, sub, icon, accent = 'purple' }: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: AccentColor;
}) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-[0.6px]">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ACCENT_CLS[accent]}`}>
          {icon}
        </div>
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
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 animate-pulse">
          <div className="h-4 w-48 bg-[#e9e9e9] rounded mb-6" />
          <div className="h-[260px] bg-[#f3f4f6] rounded" />
        </div>
      ))}
    </div>
  );
}

// ==================== Charts ====================

const SALES_SERIES: BarSeries[] = [
  { key: 'gross',      label: 'Gross Sales',          color: '#ad93e6' },
  { key: 'commission', label: 'Platform Commission',   color: '#22c55e' },
  { key: 'sellerNet',  label: 'Paid to Sellers',       color: '#3b82f6' },
];

// ==================== Content ====================

const OverviewContent = React.memo(function OverviewContent({ data }: { data: AdminDashboardOverviewResponse }) {
  const salesData: BarChartDatum[] = useMemo(
    () => data.monthlySales.map((m) => ({
      label: m.label.split(' ')[0],
      fullLabel: m.label,
      values: { gross: m.grossSales, commission: m.commissionRevenue, sellerNet: m.sellerNetAmount },
    })),
    [data.monthlySales],
  );

  const commissionData: BarChartDatum[] = useMemo(
    () => data.monthlySales.map((m) => ({
      label: m.label.split(' ')[0],
      fullLabel: m.label,
      values: { commission: m.commissionRevenue },
    })),
    [data.monthlySales],
  );

  const topSellers = data.topSellersByNetRevenue;
  const maxSellerNet = Math.max(1, ...topSellers.map((s) => s.netRevenue));

  return (
    <div className="flex flex-col gap-6">
      {/* 4 KPI boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Gross Revenue"
          value={formatCurrency(data.grossRevenue)}
          sub={`Before commission & refunds`}
          icon={AdminIcons.wallet}
          accent="purple"
        />
        <KpiCard
          label="Commission"
          value={formatCurrency(data.totalCommissionRevenue)}
          sub={`${formatCurrency(data.commissionRevenueLast30Days)} in last 30 days`}
          icon={AdminIcons.spark}
          accent="green"
        />
        <KpiCard
          label="Total Users"
          value={data.totalUsers.toLocaleString()}
          sub={`+${data.newUsersLast30Days} in last 30 days`}
          icon={AdminIcons.users}
          accent="blue"
        />
        <KpiCard
          label="Total Reviews"
          value={data.totalReviews.toLocaleString()}
          sub={data.totalReviews > 0 ? `Avg ${data.avgReviewStars.toFixed(1)} / 5 ⭐` : 'No reviews yet'}
          icon={AdminIcons.star}
          accent="amber"
        />
      </div>

      {/* Chart 1: Platform sales */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Platform sales (last 12 months)</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">Gross sales split into platform commission and seller payouts</p>
        </div>
        <BarChart
          data={salesData}
          series={SALES_SERIES}
          formatValue={formatCurrency}
          formatTick={formatCurrencyCompact}
          ariaLabel="Monthly platform sales bar chart"
        />
      </div>

      {/* Chart 2: Commission earned */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Commission earned (last 12 months)</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">The 8% platform commission collected each month</p>
        </div>
        <BarChart
          data={commissionData}
          series={[{ key: 'commission', label: 'Commission', color: '#22c55e' }]}
          formatValue={formatCurrency}
          formatTick={formatCurrencyCompact}
          showLegend={false}
          ariaLabel="Monthly commission bar chart"
        />
      </div>

      {/* Chart 3: Top sellers */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Top sellers by net revenue</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">Highest-earning sellers across the platform</p>
        </div>
        {topSellers.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#737373]">No seller revenue recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {topSellers.map((s, i) => (
              <div key={s.sellerId} className="flex items-center gap-3">
                <span className="w-5 text-[12px] font-bold text-[#9ca3af] shrink-0">{i + 1}</span>
                <div className="w-32 shrink-0 min-w-0">
                  <p className="text-[13px] font-semibold text-[#121212] truncate">{s.fullName || s.username}</p>
        <p className="text-[11px] text-[#737373]">{s.orderCount.toLocaleString()} orders</p>
                </div>
                <div className="flex-1 h-6 bg-[#f3f4f6] rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#ad93e6] to-[#9d7ed9]"
                    style={{ width: `${(s.netRevenue / maxSellerNet) * 100}%` }}
                  />
                </div>
                <span className="w-28 text-right text-[13px] font-semibold text-[#121212] shrink-0">
                  {formatCurrency(s.netRevenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ==================== Root ====================

const OverviewSection = React.memo(function OverviewSection() {
  const { data, isLoading, isError, refetch } = useAdminDashboardOverview();

  return (
    <div>
      <SellerTopbar title="Platform Overview" sub="Real-time health of the marketplace" />

      {isLoading && <OverviewSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-[15px] font-semibold text-[#121212]">Failed to load overview data</p>
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
