import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import { useLogout } from '../../services/auth.service';
import { useOpenDisputeCount } from '../../services/dispute.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import type { AdminPageId } from '../../types/admin';
import AdminSidebar from './AdminSidebar';

const OverviewSection  = lazy(() => import('./sections/OverviewSection'));
const UsersSection     = lazy(() => import('./sections/UsersSection'));
const SellersSection   = lazy(() => import('./sections/SellersSection'));
const ListingsSection  = lazy(() => import('./sections/ListingsSection'));
const OrdersSection    = lazy(() => import('./sections/OrdersSection'));
const AuctionsSection  = lazy(() => import('./sections/AuctionsSection'));
const PayoutsSection   = lazy(() => import('./sections/PayoutsSection'));
const AnalyticsSection = lazy(() => import('./sections/AnalyticsSection'));
const DisputesSection  = lazy(() => import('./sections/DisputesSection'));

const PAGE_META: Record<AdminPageId, { title: string; sub: string }> = {
  overview:  { title: 'Platform Overview',   sub: 'Real-time health of the marketplace'              },
  users:     { title: 'User Management',     sub: 'Manage buyer and seller accounts'                 },
  sellers:   { title: 'Seller Management',   sub: 'Verify sellers and manage store access'           },
  listings:  { title: 'Listings',            sub: 'Review and moderate product listings'             },
  orders:    { title: 'Orders',              sub: 'All orders across the platform'                   },
  auctions:  { title: 'Auctions',            sub: 'Monitor all live and ended auctions'              },
  payouts:   { title: 'Payout Queue',        sub: 'Approve or reject seller withdrawal requests'     },
  analytics: { title: 'Analytics',           sub: 'Platform trends, top sellers, top products'       },
  disputes:  { title: 'Disputes',            sub: 'Review and action buyer dispute requests'          },
};

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
    case 'disputes':  return <DisputesSection />;
  }
}

export { PAGE_META };

export default function AdminDashboard() {
  const [page, setPage] = useState<AdminPageId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const authUser = useAuthStore((s) => s.user);
  const toastMessage = useUiStore((s) => s.toastMessage);
  const toastVisible = useUiStore((s) => s.toastVisible);
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: openDisputeCount = 0 } = useOpenDisputeCount();

  const ROLE_LABELS: Record<string, string> = { Admin: 'Administrator', User: 'User' };

  const displayName = authUser?.username?.trim() || authUser?.email?.trim() || 'Admin';
  const sidebarUser = {
    name: displayName,
    initials: displayName.slice(0, 2).toUpperCase(),
    bg: '#7c3aed',
    role: ROLE_LABELS[authUser?.role ?? ''] ?? 'Administrator',
    email: authUser?.email,
  };

  const counts = {
    users: 0,
    orders: 0,
    payouts: 0,
    disputes: openDisputeCount,
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
        user={sidebarUser}
        counts={counts}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() =>
          logout(undefined, {
            onSettled: () => navigate('/'),
            onError: () => showToast('Sign out failed. Please try again.'),
          })
        }
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
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
