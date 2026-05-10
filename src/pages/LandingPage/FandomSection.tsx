import { Link } from 'react-router-dom';
import { useFandoms } from '../../services/fandom.service';

const ACCENTS = ['#f0edf7', '#fdf0e0', '#e8f7f0', '#fce8e8', '#e8f0fc', '#f7f0e8', '#fef9e8', '#e8f4fc'];

const nameHash = (name: string) => [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);

const toGlyph = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return name.slice(0, 3).toUpperCase();
};

const FandomSection = () => {
  const { data: fandoms = [], isLoading, isError } = useFandoms();

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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-[rgba(230,230,230,0.5)] bg-[#f4f3f7]"
            />
          ))
        ) : isError ? (
          <p className="col-span-full py-12 text-center text-sm text-[#ef4343]">
            Failed to load fandoms. Please try again.
          </p>
        ) : fandoms.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-[#737373]">
            Fandoms coming soon.
          </p>
        ) : (
          fandoms.map((f) => {
            const accent = ACCENTS[nameHash(f.name) % ACCENTS.length];
            const glyph = toGlyph(f.name);
            return (
              <Link
                key={f.id}
                to={`/fandoms?fandom=${encodeURIComponent(f.name.toLowerCase())}`}
                className="group overflow-hidden rounded-2xl border border-[rgba(230,230,230,0.5)] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_1px_2px_2px_rgba(0,0,0,0.09)]"
              >
                <div
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
                  style={{ background: accent }}
                >
                  <span className="text-[44px] font-extrabold tracking-[-1.2px] text-[rgba(18,18,18,0.78)] [text-shadow:0_1px_0_rgba(255,255,255,0.45)]">
                    {glyph}
                  </span>
                </div>

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
            );
          })
        )}
      </div>
    </section>
  );
};

export default FandomSection;
