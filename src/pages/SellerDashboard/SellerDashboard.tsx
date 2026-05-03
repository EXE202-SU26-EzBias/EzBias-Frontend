import { lazy, Suspense, useState } from 'react';
import type { PageId } from '../../types/seller';
import { useSellerDashboard } from '../../services/seller.service';
import SellerSidebar from './SellerSidebar';

const OverviewSection  = lazy(() => import('./sections/OverviewSection'));
const ListingsSection  = lazy(() => import('./sections/ListingsSection'));
const OrdersSection    = lazy(() => import('./sections/OrdersSection'));
const AuctionsSection  = lazy(() => import('./sections/AuctionsSection'));
const AnalyticsSection = lazy(() => import('./sections/AnalyticsSection'));
const PayoutsSection   = lazy(() => import('./sections/PayoutsSection'));
const SettingsSection  = lazy(() => import('./sections/SettingsSection'));

const PAGE_META: Record<PageId, { title: string; sub: string }> = {
  overview:  { title: 'Overview',      sub: 'How your store is performing right now' },
  listings:  { title: 'Listings',      sub: 'Edit, pause, duplicate, or list new merch' },
  orders:    { title: 'Orders',        sub: 'Process and ship customer orders' },
  auctions:  { title: 'Auctions',      sub: 'Track live and ended auctions you host' },
  analytics: { title: 'Analytics',     sub: 'Trends, top performers, conversion' },
  payouts:   { title: 'Payouts',       sub: 'Withdraw earnings and manage payout methods' },
  settings:  { title: 'Store profile', sub: 'Public information about your store' },
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

function renderSection(page: PageId) {
  switch (page) {
    case 'overview':  return <OverviewSection />;
    case 'listings':  return <ListingsSection />;
    case 'orders':    return <OrdersSection />;
    case 'auctions':  return <AuctionsSection />;
    case 'analytics': return <AnalyticsSection />;
    case 'payouts':   return <PayoutsSection />;
    case 'settings':  return <SettingsSection />;
  }
}

export default function SellerDashboard() {
  const [page, setPage] = useState<PageId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, isLoading } = useSellerDashboard();

  if (isLoading || !data) return <PageLoader />;

  const counts = {
    listings: data.listings.length,
    orders: data.orders.filter((o) => o.status !== 'delivered').length,
  };

  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen bg-[rgba(244,243,247,0.4)] max-[900px]:grid-cols-1">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <SellerSidebar
        active={page}
        onNav={(id) => { setPage(id); setSidebarOpen(false); }}
        user={data.user}
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

export { PAGE_META };
