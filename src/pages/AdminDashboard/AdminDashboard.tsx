import { lazy, Suspense, useState } from 'react';
import type { AdminPageId } from '../../types/admin';
import { useAdminDashboard } from '../../services/admin.service';
import AdminSidebar from './AdminSidebar';

const OverviewSection  = lazy(() => import('./sections/OverviewSection'));
const UsersSection     = lazy(() => import('./sections/UsersSection'));
const SellersSection   = lazy(() => import('./sections/SellersSection'));
const ListingsSection  = lazy(() => import('./sections/ListingsSection'));
const OrdersSection    = lazy(() => import('./sections/OrdersSection'));
const AuctionsSection  = lazy(() => import('./sections/AuctionsSection'));
const PayoutsSection   = lazy(() => import('./sections/PayoutsSection'));
const AnalyticsSection = lazy(() => import('./sections/AnalyticsSection'));

const PAGE_META: Record<AdminPageId, { title: string; sub: string }> = {
  overview:  { title: 'Platform Overview',   sub: 'Real-time health of the marketplace'              },
  users:     { title: 'User Management',     sub: 'Manage buyer and seller accounts'                 },
  sellers:   { title: 'Seller Management',   sub: 'Verify sellers and manage store access'           },
  listings:  { title: 'Listings',            sub: 'Review and moderate product listings'             },
  orders:    { title: 'Orders',              sub: 'All orders across the platform'                   },
  auctions:  { title: 'Auctions',            sub: 'Monitor all live and ended auctions'              },
  payouts:   { title: 'Payout Queue',        sub: 'Approve or reject seller withdrawal requests'     },
  analytics: { title: 'Analytics',           sub: 'Platform trends, top sellers, top products'       },
};

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
    </div>
  );
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
    </div>
  );
}

function renderSection(page: AdminPageId) {
  switch (page) {
    case 'overview':  return <OverviewSection />;
    case 'users':     return <UsersSection />;
    case 'sellers':   return <SellersSection />;
    case 'listings':  return <ListingsSection />;
    case 'orders':    return <OrdersSection />;
    case 'auctions':  return <AuctionsSection />;
    case 'payouts':   return <PayoutsSection />;
    case 'analytics': return <AnalyticsSection />;
  }
}

export { PAGE_META };

export default function AdminDashboard() {
  const [page, setPage] = useState<AdminPageId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) return <PageLoader />;

  const counts = {
    users:   data.users.filter((u) => u.status === 'suspended').length,
    orders:  data.orders.filter((o) => o.status === 'processing').length,
    payouts: data.payouts.filter((p) => p.status === 'pending').length,
  };

  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen bg-[rgba(244,243,247,0.4)] max-[900px]:grid-cols-1">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <AdminSidebar
        active={page}
        onNav={(id) => { setPage(id); setSidebarOpen(false); }}
        counts={counts}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="px-8 py-6 pb-16 min-w-0 max-[600px]:px-5">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="mb-4 flex items-center gap-2 rounded-lg border border-[#e6e6e6] bg-white px-3 py-2 text-[13px] font-medium text-[#121212] max-[900px]:flex hidden"
          aria-label="Open navigation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Menu
        </button>
        <Suspense fallback={<SectionLoader />}>
          {renderSection(page)}
        </Suspense>
      </main>
    </div>
  );
}
