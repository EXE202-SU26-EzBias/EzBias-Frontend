import { lazy, Suspense, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import Toast from '../../components/ui/Toast';
import { useUiStore } from '../../stores/ui.store';
import AuctionsSection from './AuctionsSection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import MarqueeStrip from './MarqueeStrip';
import NewsletterCTA from './NewsletterCTA';
import TrendingSection from './TrendingSection';

const LoginModal = lazy(() => import('../../components/shared/LoginModal'));
const RegisterModal = lazy(() => import('../../components/shared/RegisterModal'));
const ForgotPasswordModal = lazy(() => import('../../components/shared/ForgotPasswordModal'));
const EmailVerificationModal = lazy(() => import('../../components/shared/EmailVerificationModal'));

const LandingPage = () => {
  const trendingRef = useRef<HTMLElement>(null);
  const auctionsRef = useRef<HTMLElement>(null);
  const {
    toastMessage,
    toastVisible,
    toastType,
    isLoginOpen,
    isRegisterOpen,
    isForgotPasswordOpen,
    isEmailVerificationOpen,
  } = useUiStore(
    useShallow((s) => ({
      toastMessage: s.toastMessage,
      toastVisible: s.toastVisible,
      toastType: s.toastType,
      isLoginOpen: s.isLoginOpen,
      isRegisterOpen: s.isRegisterOpen,
      isForgotPasswordOpen: s.isForgotPasswordOpen,
      isEmailVerificationOpen: s.isEmailVerificationOpen,
    })),
  );

  return (
    <>
      <Header />
      <main>
        <HeroSection trendingRef={trendingRef} auctionsRef={auctionsRef} />
        <MarqueeStrip />
        <TrendingSection sectionRef={trendingRef} />
        {/* <FandomSection /> */}
        <AuctionsSection sectionRef={auctionsRef} />
        <FeaturesSection />
        <NewsletterCTA />
      </main>
      <Footer />
      {isLoginOpen && (
        <Suspense fallback={null}>
          <LoginModal />
        </Suspense>
      )}
      {isRegisterOpen && (
        <Suspense fallback={null}>
          <RegisterModal />
        </Suspense>
      )}
      {isForgotPasswordOpen && (
        <Suspense fallback={null}>
          <ForgotPasswordModal />
        </Suspense>
      )}
      {isEmailVerificationOpen && (
        <Suspense fallback={null}>
          <EmailVerificationModal />
        </Suspense>
      )}
      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </>
  );
};

export default LandingPage;
