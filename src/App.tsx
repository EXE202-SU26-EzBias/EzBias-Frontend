import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import { queryClient } from './lib/queryClient';

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const FandomPage = lazy(() => import('./pages/FandomPage/FandomPage'));
const AuctionPage = lazy(() => import('./pages/AuctionPage/AuctionPage'));
const AuctionDetailPage = lazy(() => import('./pages/AuctionPage/AuctionDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutUsPage/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/fandoms" element={<FandomPage />} />
              <Route path="/auction" element={<AuctionPage />} />
              <Route path="/auction/:id" element={<AuctionDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
