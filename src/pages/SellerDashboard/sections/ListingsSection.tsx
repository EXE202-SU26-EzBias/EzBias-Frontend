import React, { useMemo, useState } from 'react';
import { useDeleteProduct, useProducts } from '../../../services/product.service';
import ListingsTable from '../ListingsTable';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

const ListingsSection = React.memo(function ListingsSection() {
  const { data: products = [], isLoading, isError } = useProducts();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [products, search]);

  return (
    <div>
      <SellerTopbar title="Listings" sub="Edit, pause, duplicate, or list new merch" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">
              All listings <span className="text-[#737373] font-normal text-[14px]">({products.length})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">{Icons.search}</span>
              <input
                type="text"
                placeholder="Search listings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 border border-[#e6e6e6] rounded-full bg-white text-[14px] text-[#121212] outline-none placeholder:text-[#b3b3b3] focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
              />
            </div>
            <button className="h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center gap-1.5">
              {Icons.plus} New listing
            </button>
          </div>
        </div>
        {isLoading && <p className="px-5 py-6 text-[14px] text-[#737373]">Loading…</p>}
        {isError && <p className="px-5 py-6 text-[14px] text-[#ef4343]">Failed to load listings. Please try again.</p>}
        {!isLoading && !isError && <ListingsTable listings={filtered} onDelete={(id) => deleteMutation.mutate(id)} />}
      </div>
    </div>
  );
});

export default ListingsSection;
