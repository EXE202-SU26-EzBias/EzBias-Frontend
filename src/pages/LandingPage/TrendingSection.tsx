import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/card/ProductCard';
import type { FandomProduct } from '../../types/fandom';

interface TrendingSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
}

const products: FandomProduct[] = [];

const TrendingSection = ({ sectionRef }: TrendingSectionProps) => {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-[#737373]">Trending items coming soon.</p>
        ) : (
          products.map((p) => <ProductCard key={p.id} {...p} />)
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
