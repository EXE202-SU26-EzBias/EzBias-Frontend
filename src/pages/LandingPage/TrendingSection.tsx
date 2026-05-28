import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/card/ProductCard';
import { useFandomProducts } from '../../services/fandom.service';

interface TrendingSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

const TrendingSection = ({ sectionRef }: TrendingSectionProps) => {
  const { data: allProducts = [], isLoading } = useFandomProducts();

  // Show the 8 most recently listed non-auction products
  const trending = allProducts
    .filter((p) => !p.isAuction && p.stock > 0)
    .slice(0, 8);

  return (
    <section ref={sectionRef} className="mx-auto max-w-[1400px] px-6 py-16" aria-label="Trending Now">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[30px] font-bold text-[#121212]">Trending Now</h2>
        <Link
          to="/fandoms"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#ad93e6] transition-colors hover:text-[#9d7ed9]"
        >
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-[#f0edf7]" />
          ))}
        </div>
      ) : trending.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#737373]">Trending items coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
