import { lazy, Suspense, useState } from 'react';
import { SELLER_DATA } from './sellerMockData';
import SellerSidebar from './SellerSidebar';

const OverviewSection  = lazy(() => import('./sections/OverviewSection'));
const ListingsSection  = lazy(() => import('./sections/ListingsSection'));
const OrdersSection    = lazy(() => import('./sections/OrdersSection'));
const AuctionsSection  = lazy(() => import('./sections/AuctionsSection'));
const AnalyticsSection = lazy(() => import('./sections/AnalyticsSection'));
const PayoutsSection   = lazy(() => import('./sections/PayoutsSection'));
const SettingsSection  = lazy(() => import('./sections/SettingsSection'));

type PageId = 'overview' | 'listings' | 'orders' | 'auctions' | 'analytics' | 'payouts' | 'settings';

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
    </div>
  );
}

function renderSection(page: PageId) {
  switch (page) {
    case 'overview':  return <OverviewSection  data={SELLER_DATA} />;
    case 'listings':  return <ListingsSection  data={SELLER_DATA} />;
    case 'orders':    return <OrdersSection    data={SELLER_DATA} />;
    case 'auctions':  return <AuctionsSection  data={SELLER_DATA} />;
    case 'analytics': return <AnalyticsSection data={SELLER_DATA} />;
    case 'payouts':   return <PayoutsSection   data={SELLER_DATA} />;
    case 'settings':  return <SettingsSection  data={SELLER_DATA} />;
  }
}

export default function SellerDashboard() {
  const [page, setPage] = useState<PageId>('overview');

  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen bg-[rgba(244,243,247,0.4)] max-[900px]:grid-cols-1">
      <SellerSidebar
        active={page}
        onNav={setPage}
        user={SELLER_DATA.user}
      />
      <main className="px-8 py-6 pb-16 min-w-0 max-[600px]:px-5">
        <Suspense fallback={<SectionLoader />}>
          {renderSection(page)}
        </Suspense>
      </main>
    </div>
  );
}
