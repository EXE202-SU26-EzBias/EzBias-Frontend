import React, { useMemo } from 'react';
import { deriveAlerts, type AlertInfo, type Severity } from '../../../features/admin/useAdminOverview';
import { useAdminDashboardOverview } from '../../../services/admin.service';
import type { AdminDashboardOverviewResponse, AdminOverviewNumericKey } from '../../../types/admin';
import { formatCurrency } from '../../../utils/formatters';
import { AdminIcons } from '../adminIcons';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

// ==================== Skeletons ====================

function SkeletonCard() {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-20 bg-[#e9e9e9] rounded" />
        <div className="w-8 h-8 bg-[#e9e9e9] rounded-lg" />
      </div>
      <div className="h-7 w-28 bg-[#e9e9e9] rounded mb-2" />
      <div className="h-2.5 w-16 bg-[#e9e9e9] rounded" />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] animate-pulse">
          <div className="h-4 w-44 bg-[#e9e9e9] rounded mb-5" />
          <div className="h-2.5 w-full bg-[#e9e9e9] rounded-full mb-6" />
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-3 bg-[#e9e9e9] rounded" />)}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] animate-pulse">
            <div className="h-4 w-24 bg-[#e9e9e9] rounded mb-4" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-3 bg-[#e9e9e9] rounded" />)}
            </div>
          </div>
          <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] animate-pulse">
            <div className="h-4 w-28 bg-[#e9e9e9] rounded mb-4" />
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-3 bg-[#e9e9e9] rounded" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-4 animate-pulse flex gap-3">
            <div className="w-8 h-8 bg-[#e9e9e9] rounded-lg shrink-0" />
            <div className="flex-1 flex flex-col gap-2 pt-0.5">
              <div className="h-3 w-24 bg-[#e9e9e9] rounded" />
              <div className="h-2.5 w-full bg-[#e9e9e9] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Metric Card ====================

type AccentColor = 'purple' | 'green' | 'red' | 'amber' | 'blue';

const ACCENT_ICON_CLS: Record<AccentColor, string> = {
  purple: 'bg-[rgba(173,147,230,0.1)] text-[#ad93e6] border border-[rgba(173,147,230,0.2)]',
  green:  'bg-[rgba(34,197,94,0.08)] text-[#22c55e] border border-[rgba(34,197,94,0.2)]',
  red:    'bg-[rgba(239,67,67,0.08)] text-[#ef4343] border border-[rgba(239,67,67,0.2)]',
  amber:  'bg-[rgba(245,158,11,0.08)] text-[#d97706] border border-[rgba(245,158,11,0.2)]',
  blue:   'bg-[rgba(59,130,246,0.08)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]',
};

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: AccentColor;
}

function MetricCard({ label, value, sub, icon, accent = 'purple' }: MetricCardProps) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-[0.6px]">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ACCENT_ICON_CLS[accent]}`}>
          {icon}
        </div>
      </div>
      <div className="font-bold text-[24px] tracking-[-0.8px] text-[#121212] leading-none mb-1.5 truncate">{value}</div>
      {sub && <div className="text-[11px] text-[#737373]">{sub}</div>}
    </div>
  );
}

// ==================== Order Status Panel ====================

const STATUS_CONFIG: Array<{ key: AdminOverviewNumericKey; label: string; color: string }> = [
  { key: 'pendingOrders',         label: 'Pending',      color: '#f59e0b' },
  { key: 'paidOrders',            label: 'Paid',         color: '#3b82f6' },
  { key: 'processingOrders',      label: 'Processing',   color: '#ad93e6' },
  { key: 'shippedOrders',         label: 'Shipped',      color: '#6366f1' },
  { key: 'deliveredOrders',       label: 'Delivered',    color: '#06b6d4' },
  { key: 'returnRequestedOrders', label: 'Return Req.',  color: '#f97316' },
  { key: 'completedOrders',       label: 'Completed',    color: '#22c55e' },
  { key: 'canceledOrders',        label: 'Canceled',     color: '#ef4343' },
  { key: 'refundedOrders',        label: 'Refunded',     color: '#9ca3af' },
];

function OrderStatusPanel({ data }: { data: AdminDashboardOverviewResponse }) {
  const items = STATUS_CONFIG.map((cfg) => ({ ...cfg, count: data[cfg.key] }));
  const total = data.totalOrders;

  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="mb-5">
        <h2 className="text-[14px] font-bold text-[#121212]">Order Status Distribution</h2>
        <p className="text-[12px] text-[#737373] mt-0.5">{total.toLocaleString()} total orders</p>
      </div>

      <div
        role="img"
        aria-label="Order status distribution bar"
        className="flex h-2 rounded-full overflow-hidden bg-[#f3f4f6] mb-5"
      >
        {total > 0 && items.filter((i) => i.count > 0).map((item) => (
          <div
            key={item.key}
            style={{ width: `${(item.count / total) * 100}%`, backgroundColor: item.color }}
            title={`${item.label}: ${item.count}`}
            className="shrink-0 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[12px] text-[#737373] truncate">{item.label}</span>
            </div>
            <span className="text-[12px] font-semibold text-[#121212] shrink-0">{item.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Revenue Panel ====================

function RevenuePanel({ data }: { data: AdminDashboardOverviewResponse }) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-[14px] font-bold text-[#121212] mb-4">Revenue</h2>
      <div className="pb-4 border-b border-[rgba(230,230,230,0.5)] mb-3">
        <p className="text-[10px] font-semibold text-[#737373] uppercase tracking-[0.5px] mb-1.5">Gross Revenue</p>
        <p className="text-[22px] font-bold text-[#121212] tracking-[-0.8px] leading-none">{formatCurrency(data.grossRevenue)}</p>
      </div>
      <div className="flex items-center justify-between py-2.5 border-b border-[rgba(230,230,230,0.4)]">
        <span className="text-[12px] text-[#737373]">Refunded</span>
        <span className="text-[13px] font-semibold text-[#ef4343]">− {formatCurrency(data.refundedAmount)}</span>
      </div>
      <div className="flex items-center justify-between pt-3">
        <span className="text-[13px] font-bold text-[#121212]">Net Revenue</span>
        <span className="text-[16px] font-bold text-[#22c55e] tracking-[-0.5px]">{formatCurrency(data.netRevenue)}</span>
      </div>
    </div>
  );
}

// ==================== User Growth Panel ====================

function formatGrowth(n: number): string {
  if (n <= 0) return n.toLocaleString();
  return `+${n.toLocaleString()}`;
}

function UserGrowthPanel({ data }: { data: AdminDashboardOverviewResponse }) {
  const rows = [
    { label: 'Total users',  value: data.totalUsers.toLocaleString() },
    { label: 'New today',    value: formatGrowth(data.newUsersToday) },
    { label: 'Last 7 days',  value: formatGrowth(data.newUsersLast7Days) },
    { label: 'Last 30 days', value: formatGrowth(data.newUsersLast30Days) },
  ];

  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <h2 className="text-[14px] font-bold text-[#121212] mb-4">User Growth</h2>
      <div className="flex flex-col">
        {rows.map(({ label, value }, idx) => (
          <div
            key={label}
            className={`flex items-center justify-between py-2.5 ${idx < rows.length - 1 ? 'border-b border-[rgba(230,230,230,0.4)]' : ''}`}
          >
            <span className="text-[12px] text-[#737373]">{label}</span>
            <span className="text-[14px] font-bold text-[#121212]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Alert Card ====================

const SEVERITY_CLS: Record<Severity, { card: string; badge: string }> = {
  high:   { card: 'border-[rgba(239,67,67,0.25)] bg-[rgba(239,67,67,0.03)]',    badge: 'bg-[rgba(239,67,67,0.1)] text-[#ef4343]' },
  medium: { card: 'border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.03)]',  badge: 'bg-[rgba(245,158,11,0.1)] text-[#d97706]' },
  low:    { card: 'border-[rgba(173,147,230,0.25)] bg-[rgba(173,147,230,0.03)]', badge: 'bg-[rgba(173,147,230,0.12)] text-[#7c5cbe]' },
};

interface AlertCardProps extends AlertInfo {
  icon: React.ReactNode;
}

function AlertCard({ label, count, description, icon, severity }: AlertCardProps) {
  const s = SEVERITY_CLS[severity];
  return (
    <div
      role="status"
      aria-label={`${label}: ${count} items, ${severity} priority`}
      className={`rounded-xl border p-4 flex items-start gap-3 ${s.card}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.badge}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[13px] font-semibold text-[#121212] truncate">{label}</span>
          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0 ${s.badge}`}>{count}</span>
        </div>
        <p className="text-[11px] text-[#737373] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Map alert key → icon; kept in the UI layer (icons are a UI concern)
const ALERT_ICONS: Record<string, React.ReactNode> = {
  ordersToProcess: AdminIcons.bag,
  openDisputes:    AdminIcons.flag,
  pendingRefunds:  AdminIcons.wallet,
  pendingPayouts:  AdminIcons.chart,
};

function alertIcon(id: string): React.ReactNode {
  return ALERT_ICONS[id] ?? null;
}

// ==================== Main Content ====================

const OverviewContent = React.memo(function OverviewContent({ data }: { data: AdminDashboardOverviewResponse }) {
  const alertsWithIcons = useMemo<AlertCardProps[]>(
    () => deriveAlerts(data).map((alert) => ({ ...alert, icon: alertIcon(alert.id) })),
    [data],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1 — KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          label="Net Revenue"
          value={formatCurrency(data.netRevenue)}
          sub={`Gross ${formatCurrency(data.grossRevenue)}`}
          icon={AdminIcons.wallet}
          accent="purple"
        />
        <MetricCard
          label="Total Orders"
          value={data.totalOrders.toLocaleString()}
          sub={`${data.completedOrders.toLocaleString()} completed`}
          icon={AdminIcons.bag}
          accent="blue"
        />
        <MetricCard
          label="Pending Orders"
          value={data.pendingOrders.toLocaleString()}
          sub={`${data.paidOrders.toLocaleString()} paid · ${data.processingOrders.toLocaleString()} processing`}
          icon={AdminIcons.chart}
          accent="amber"
        />
        <MetricCard
          label="Completed"
          value={data.completedOrders.toLocaleString()}
          sub={`${data.deliveredOrders.toLocaleString()} delivered`}
          icon={AdminIcons.check}
          accent="green"
        />
        <MetricCard
          label="Open Disputes"
          value={data.openDisputes.toLocaleString()}
          sub={`${data.pendingRefunds.toLocaleString()} pending refund`}
          icon={AdminIcons.flag}
          accent="red"
        />
      </div>

      {/* Row 2 — Order distribution + Revenue + Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <OrderStatusPanel data={data} />
        </div>
        <div className="flex flex-col gap-4">
          <RevenuePanel data={data} />
          <UserGrowthPanel data={data} />
        </div>
      </div>

      {/* Row 3 — Needs attention */}
      <div>
        <h2 className="text-[14px] font-bold text-[#121212] mb-3">Needs Attention</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {alertsWithIcons.map((item) => (
            <AlertCard key={item.id} {...item} />
          ))}
        </div>
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
            aria-label="Retry loading overview data"
            onClick={() => refetch()}
            className="mt-1 text-[13px] font-medium px-5 h-9 rounded-full border border-[#e6e6e6] bg-white text-[#737373] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && !data && (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-[rgba(230,230,230,0.5)] rounded-xl">
          <p className="text-[15px] font-semibold text-[#121212] mb-1">No data available</p>
          <p className="text-[13px] text-[#737373]">Overview data could not be retrieved.</p>
        </div>
      )}

      {!isLoading && !isError && data && <OverviewContent data={data} />}
    </div>
  );
});

export default OverviewSection;
