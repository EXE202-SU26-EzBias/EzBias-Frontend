import { useRef } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Toast from '../../components/ui/Toast';
import LoginModal from '../../components/ui/LoginModal';
import HeroSection from './HeroSection';
import MarqueeStrip from './MarqueeStrip';
import TrendingSection from './TrendingSection';
import FandomSection from './FandomSection';
import AuctionsSection from './AuctionsSection';
import FeaturesSection from './FeaturesSection';
import NewsletterCTA from './NewsletterCTA';
import { useUiStore } from '../../stores/ui.store';

const LandingPage = () => {
  const trendingRef = useRef<HTMLElement>(null);
  const auctionsRef = useRef<HTMLElement>(null);
  const toastMessage = useUiStore((s) => s.toastMessage);
  const toastVisible = useUiStore((s) => s.toastVisible);

  return (
    <>
      <Header />
      <main>
        <HeroSection trendingRef={trendingRef} auctionsRef={auctionsRef} />
        <MarqueeStrip />
        <TrendingSection sectionRef={trendingRef} />
        <FandomSection />
        <AuctionsSection sectionRef={auctionsRef} />
        <FeaturesSection />
        <NewsletterCTA />
      </main>
      <Footer />
      <LoginModal />
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
};

export default LandingPage;
