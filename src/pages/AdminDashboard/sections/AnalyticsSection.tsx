import React, { useMemo } from 'react';
import BarChart, { type BarChartDatum, type BarSeries } from '../../../components/charts/BarChart';
import { useAdminDashboardOverview } from '../../../services/admin.service';
import type { AdminDashboardOverviewResponse } from '../../../types/admin';
import { formatCurrency, formatCurrencyCompact } from '../../../utils/formatters';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

// ==================== Summary card ====================

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: accent }} />
        <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-[0.6px]">{label}</span>
      </div>
      <div className="font-bold text-[24px] tracking-[-0.8px] text-[#121212] leading-none mb-1.5 truncate">{value}</div>
      {sub && <div className="text-[11px] text-[#737373]">{sub}</div>}
    </div>
  );
}

// ==================== Skeleton ====================

function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 animate-pulse">
            <div className="h-3 w-24 bg-[#e9e9e9] rounded mb-3" />
            <div className="h-7 w-28 bg-[#e9e9e9] rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 animate-pulse">
        <div className="h-4 w-48 bg-[#e9e9e9] rounded mb-6" />
        <div className="h-[260px] bg-[#f3f4f6] rounded" />
      </div>
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 animate-pulse">
        <div className="h-4 w-40 bg-[#e9e9e9] rounded mb-6" />
        <div className="h-[260px] bg-[#f3f4f6] rounded" />
      </div>
    </div>
  );
}

// ==================== Content ====================

const SALES_SERIES: BarSeries[] = [
  { key: 'gross', label: 'Gross sales', color: '#ad93e6' },
  { key: 'commission', label: 'Platform commission', color: '#22c55e' },
  { key: 'sellerNet', label: 'Paid to sellers', color: '#3b82f6' },
];

const AnalyticsContent = React.memo(function AnalyticsContent({ data }: { data: AdminDashboardOverviewResponse }) {
  const salesData: BarChartDatum[] = useMemo(
    () =>
      data.monthlySales.map((m) => ({
        label: m.label.split(' ')[0],
        fullLabel: m.label,
        values: { gross: m.grossSales, commission: m.commissionRevenue, sellerNet: m.sellerNetAmount },
      })),
    [data.monthlySales],
  );

  const commissionData: BarChartDatum[] = useMemo(
    () =>
      data.monthlySales.map((m) => ({
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
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SummaryCard label="Gross sales (all time)" value={formatCurrency(data.grossRevenue)} sub={`${data.totalOrders.toLocaleString()} orders`} accent="#ad93e6" />
        <SummaryCard label="Commission earned" value={formatCurrency(data.totalCommissionRevenue)} sub={`${formatCurrency(data.commissionRevenueLast30Days)} last 30 days`} accent="#22c55e" />
        <SummaryCard label="Net revenue" value={formatCurrency(data.netRevenue)} sub={`After ${formatCurrency(data.refundedAmount)} refunds`} accent="#3b82f6" />
      </div>

      {/* Monthly sales + commission */}
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-[#121212]">Platform sales (last 12 months)</h2>
          <p className="text-[12px] text-[#737373] mt-0.5">Gross sales split into platform commission and seller payouts</p>
        </div>
        <BarChart data={salesData} series={SALES_SERIES} formatValue={formatCurrency} formatTick={formatCurrencyCompact} ariaLabel="Monthly platform sales bar chart" />
      </div>

      {/* Commission trend */}
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

      {/* Top sellers */}
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
                  <p className="text-[11px] text-[#737373] truncate">{s.orderCount.toLocaleString()} orders</p>
                </div>
                <div className="flex-1 h-6 bg-[#f3f4f6] rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#ad93e6] to-[#9d7ed9]"
                    style={{ width: `${(s.netRevenue / maxSellerNet) * 100}%` }}
                  />
                </div>
                <span className="w-28 text-right text-[13px] font-semibold text-[#121212] shrink-0">{formatCurrency(s.netRevenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ==================== Root ====================

const AnalyticsSection = React.memo(function AnalyticsSection() {
  const { data, isLoading, isError, refetch } = useAdminDashboardOverview();

  return (
    <div>
      <SellerTopbar title="Analytics" sub="Platform trends, top sellers, commission" />

      {isLoading && <AnalyticsSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-[15px] font-semibold text-[#121212]">Failed to load analytics</p>
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

      {!isLoading && !isError && data && <AnalyticsContent data={data} />}
    </div>
  );
});

export default AnalyticsSection;
