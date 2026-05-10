import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import LoginModal from '../../components/shared/LoginModal';
import RegisterModal from '../../components/shared/RegisterModal';
import Toast from '../../components/ui/Toast';
import { useUiStore } from '../../stores/ui.store';
import AuctionsSection from './AuctionsSection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import MarqueeStrip from './MarqueeStrip';
import NewsletterCTA from './NewsletterCTA';
import TrendingSection from './TrendingSection';

const LandingPage = () => {
  const trendingRef = useRef<HTMLElement>(null);
  const auctionsRef = useRef<HTMLElement>(null);
  const { toastMessage, toastVisible } = useUiStore(
    useShallow((s) => ({ toastMessage: s.toastMessage, toastVisible: s.toastVisible })),
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
      <LoginModal />
      <RegisterModal />
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
};

export default LandingPage;
