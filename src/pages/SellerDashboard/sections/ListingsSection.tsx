import React, { useCallback, useMemo, useState } from 'react';
import { useDeleteProduct, useProducts } from '../../../services/product.service';
import { useUiStore } from '../../../stores/ui.store';
import type { SellerProduct } from '../../../types/seller';
import ListingsTable from '../ListingsTable';
import ProductFormModal from '../ProductFormModal';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

// undefined = closed, null = add mode, SellerProduct = edit mode
type FormTarget = SellerProduct | null | undefined;

const ListingsSection = React.memo(function ListingsSection() {
  const { data: products = [], isLoading, isError } = useProducts();
  const deleteMutation = useDeleteProduct();
  const showToast = useUiStore((s) => s.showToast);

  const [search, setSearch] = useState('');
  const [formTarget, setFormTarget] = useState<FormTarget>(undefined);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const handleEdit = useCallback((listing: SellerProduct) => setFormTarget(listing), []);

  const handleDelete = useCallback(
    (id: number) =>
      deleteMutation.mutate(id, {
        onSuccess: () => showToast('Listing deleted.', 'success'),
        onError: () => showToast('Failed to delete listing. Please try again.', 'error'),
      }),
    [deleteMutation, showToast],
  );

  return (
    <div>
      <SellerTopbar title="Listings" sub="Manage, edit, or list new merch" />

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
            <button
              type="button"
              onClick={() => setFormTarget(null)}
              className="h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center gap-1.5"
            >
              {Icons.plus} New listing
            </button>
          </div>
        </div>

        {isLoading && <p className="px-5 py-6 text-[14px] text-[#737373]">Loading…</p>}
        {isError && <p className="px-5 py-6 text-[14px] text-[#ef4343]">Failed to load listings. Please try again.</p>}
        {!isLoading && !isError && (
          <ListingsTable
            listings={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {formTarget !== undefined && (
        <ProductFormModal
          product={formTarget}
          onClose={() => setFormTarget(undefined)}
        />
      )}
    </div>
  );
});

export default ListingsSection;
