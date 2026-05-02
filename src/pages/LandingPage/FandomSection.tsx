import { Link } from 'react-router-dom';
import type { Fandom } from '../../types/landing';

const FandomSection = () => {
  const fandoms: Fandom[] = [];

  return (
  <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-8" aria-label="Shop by Fandom">
    <div className="mb-8 flex items-center justify-between">
      <h2 className="text-[30px] font-bold text-[#121212]">Shop By Fandom</h2>
      <Link
        to="/fandoms"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#ad93e6] transition-colors hover:text-[#9d7ed9]"
      >
        See All Fandoms →
      </Link>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {fandoms.map((f) => (
        <Link
          key={f.name}
          to={`/fandoms?fandom=${f.name.toLowerCase()}`}
          className="group overflow-hidden rounded-2xl border border-[rgba(230,230,230,0.5)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_1px_2px_2px_rgba(0,0,0,0.09)]"
        >
          {/* Media */}
          <div
            className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${f.accent}, #fcf6e8)` }}
          >
            <span className="text-[44px] font-extrabold tracking-[-1.2px] text-[rgba(18,18,18,0.78)] [text-shadow:0_1px_0_rgba(255,255,255,0.45)]">
              {f.glyph}
            </span>
            <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#121212] backdrop-blur-sm">
              {f.items} items
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3.5 text-[#121212] transition-colors group-hover:text-[#ad93e6]">
            <span className="text-[15px] font-semibold">{f.name}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  </section>
  );
};

export default FandomSection;
