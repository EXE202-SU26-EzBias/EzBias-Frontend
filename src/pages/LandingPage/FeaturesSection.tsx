import type { ReactNode } from 'react';

interface Feature {
  title: string;
  body: string;
  icon: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: 'Authenticity Guaranteed',
    body: "Every item is verified against the artist's official partners before it ships.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Live Auctions',
    body: 'Bid on rare collectibles in real time, with paddle history and sniping protection.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m14 5 5 5" />
        <path d="M9.5 9.5 4 15l5 5 5.5-5.5" />
        <path d="M11 7 17 1l6 6-6 6" />
        <path d="M3 21h8" />
      </svg>
    ),
  },
  {
    title: 'Worldwide Shipping',
    body: 'Tracked delivery to 80+ countries, with combined shipping for multi-fandom hauls.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: 'Fan-First Returns',
    body: 'Damaged in transit? Send it back within 14 days for a full refund or replacement.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
];

const FeaturesSection = () => (
  <section className="mx-auto max-w-[1400px] px-6 py-8" aria-label="Why EzBias">
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[rgba(230,230,230,0.5)] bg-white p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f) => (
        <div key={f.title} className="flex flex-col gap-2">
          <span className="mb-1 inline-grid h-11 w-11 place-items-center rounded-xl bg-[rgba(173,147,230,0.12)] text-[#ad93e6]">
            {f.icon}
          </span>
          <h3 className="text-[15px] font-bold text-[#121212]">{f.title}</h3>
          <p className="text-[13px] leading-[1.55] text-[#737373]">{f.body}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
