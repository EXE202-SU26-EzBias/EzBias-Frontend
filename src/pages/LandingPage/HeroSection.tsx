import type { RefObject } from 'react';
import { SparkleIcon } from '../../components/ui/Icon';

interface HeroSectionProps {
  trendingRef: RefObject<HTMLElement | null>;
  auctionsRef: RefObject<HTMLElement | null>;
}

const scrollToSection = (ref: RefObject<HTMLElement | null>) =>
  ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const HeroSection = ({ trendingRef, auctionsRef }: HeroSectionProps) => (
  <section className="relative overflow-hidden" aria-label="Hero">
    {/* Background image */}
    <img
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      src="/background.jpg"
      alt=""
      aria-hidden="true"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />

    {/* Blur orbs */}
    <div
      className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[rgba(173,147,230,0.10)] blur-3xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[rgba(173,147,230,0.05)] blur-3xl"
      aria-hidden="true"
    />

    {/* Content */}
    <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-6 px-6 py-24">
      {/* Pill badge */}
      <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(147,183,230,0.73)] px-4 py-1.5">
        <SparkleIcon className="h-3 w-3 text-[#9d73f9]" aria-hidden="true" />
        <span className="whitespace-nowrap text-xs font-semibold text-[#9d73f9]">
          Your #1 K-pop Merch Destination
        </span>
      </span>

      {/* Headline */}
      <h1 className="max-w-[900px] text-center text-[32px] font-extrabold leading-[1.04] tracking-[-1.2px] text-[#121212] md:text-[42px] xl:text-[60px] xl:tracking-[-1.5px]">
        Discover and Collect Your
        <br className="hidden sm:block" />
        Favorite <span className="text-[#ad93e6]">K-pop</span> Merch
      </h1>

      {/* Sub */}
      <p className="max-w-[640px] text-center text-sm leading-relaxed text-[#737373] md:text-[18px] md:leading-[1.6]">
        From lightsticks to limited-edition albums — shop authentic
        <br className="hidden md:block" />
        merchandise from the groups you love.
      </p>

      {/* CTAs */}
      <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
        <button
          onClick={() => scrollToSection(trendingRef)}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#ad93e6] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9]"
        >
          Shop Now
        </button>
        <button
          onClick={() => scrollToSection(auctionsRef)}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#ad93e6] bg-white px-8 text-sm font-semibold text-[#ad93e6] transition-colors hover:bg-[#ad93e6] hover:text-white"
        >
          Live Auctions
        </button>
      </div>
    </div>
  </section>
);

export default HeroSection;
