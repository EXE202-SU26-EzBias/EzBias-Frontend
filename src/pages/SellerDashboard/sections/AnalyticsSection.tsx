import React, { useMemo } from 'react';
import { useProducts } from '../../../services/product.service';
import ListingsTable from '../ListingsTable';
import SellerTopbar from '../SellerTopbar';

const AnalyticsSection = React.memo(function AnalyticsSection() {
  const { data: products = [], isLoading } = useProducts();
  const topListings = useMemo(() => products.slice(0, 5), [products]);

  return (
    <div>
      <SellerTopbar title="Analytics" sub="Trends, top performers, conversion" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-12 text-center text-[14px] text-[#737373] mb-6">
        Revenue trends coming soon
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Top listings</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Your most recent products</p>
          </div>
        </div>
        {isLoading && <p className="px-5 py-6 text-[14px] text-[#737373]">Loading…</p>}
        {!isLoading && <ListingsTable listings={topListings} />}
      </div>
    </div>
  );
});

export default AnalyticsSection;
