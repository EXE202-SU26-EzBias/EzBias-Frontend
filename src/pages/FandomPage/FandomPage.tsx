import { useState } from 'react';
import ProductCard from '../../components/card/ProductCard';
import PageLayout from '../../components/layout/PageLayout';
import Tabs from '../../components/ui/Tabs';
import type { Product } from '../../types/landing';

const ALL_TAB = 'All';

const FandomPage = () => {
  const tabs: string[] = [];
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [searchTerm, setSearchTerm] = useState('');

  const products: Product[] = [];

  const filtered = searchTerm.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : products;

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:py-16">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#121212] md:text-3xl">Browse by Fandom</h1>
          <p className="text-sm text-[#737373]">Find merch from your favorite groups</p>
        </div>

        {tabs.length > 0 && (
          <div className="mb-6">
            <label htmlFor="fandom-product-search" className="sr-only">Search products</label>
            <input
              id="fandom-product-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name..."
              className="w-full rounded-xl border border-[#e6e6e6] bg-white px-4 py-2.5 text-sm text-[#121212] outline-none transition focus:border-[#ad93e6] focus:ring-2 focus:ring-[rgba(173,147,230,0.2)]"
            />
          </div>
        )}

        {tabs.length > 0 && (
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onSelect={(tab) => {
              setSearchTerm('');
              setActiveTab(tab);
            }}
          />
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" role="list">
            {filtered.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-[#737373]">
            {searchTerm.trim()
              ? 'No products match your search in this fandom.'
              : activeTab === ALL_TAB
                ? 'No products found yet.'
                : 'No products found for this fandom yet.'}
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default FandomPage;
