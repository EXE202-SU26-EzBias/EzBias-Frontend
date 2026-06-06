import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/layout/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import VideoCallRoot from './components/video-call/VideoCallRoot';
import GlobalHooks from './components/providers/GlobalHooks';
import { queryClient } from './lib/queryClient';

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const FandomPage = lazy(() => import('./pages/FandomPage/FandomPage'));
const ProductDetailPage = lazy(() => import('./pages/FandomPage/ProductDetailPage'));
const AuctionPage = lazy(() => import('./pages/AuctionPage/AuctionPage'));
const AuctionDetailPage = lazy(() => import('./pages/AuctionPage/AuctionDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutUsPage/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage/OrderConfirmationPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage/PaymentPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage/PrivacyPolicyPage'));
const AccountDeletionPage = lazy(() => import('./pages/AccountDeletionPage/AccountDeletionPage'));

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
      <BrowserRouter>
        <ErrorBoundary>
          <GlobalHooks />
          <Suspense fallback={<PageLoader />}>
            <VideoCallRoot />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/fandoms" element={<FandomPage />} />
              <Route path="/fandoms/:id" element={<ProductDetailPage />} />
              <Route path="/auction" element={<AuctionPage />} />
              <Route path="/auction/:id" element={<AuctionDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/payment/:paymentId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/account-deletion" element={<AccountDeletionPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
