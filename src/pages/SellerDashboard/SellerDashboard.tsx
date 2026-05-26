import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import { useLogout } from '../../services/auth.service';
import { useProducts } from '../../services/product.service';
import { useSellerOrders } from '../../services/seller-order.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import SellerSidebar from './SellerSidebar';

type PageId = 'overview' | 'listings' | 'orders' | 'auctions' | 'analytics' | 'payouts' | 'settings';

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
  settings:  { title: 'User profile',  sub: 'Manage your account details' },
};

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
  const { data: products = [] } = useProducts();
  // TanStack Query deduplicates this with the same call in OrdersSection
  const { data: sellerOrders = [] } = useSellerOrders();
  const authUser = useAuthStore((s) => s.user);
  const toastMessage = useUiStore((s) => s.toastMessage);
  const toastVisible = useUiStore((s) => s.toastVisible);
  const toastType = useUiStore((s) => s.toastType);
  const navigate = useNavigate();
  const { mutate: logout, isPending: loggingOut } = useLogout();

  const displayName = authUser?.username ?? authUser?.email ?? 'Seller';
  const sidebarUser = {
    name: displayName,
    initials: displayName.slice(0, 2).toUpperCase(),
    bg: '#9b84ec',
    role: authUser?.role ?? 'Seller',
    email: authUser?.email,
  };

  const counts = {
    listings: products.length,
    orders: sellerOrders.length,
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
        user={sidebarUser}
        counts={counts}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => logout(undefined, { onSettled: () => navigate('/') })}
        loggingOut={loggingOut}
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
      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  );
}

export { PAGE_META };
