import React, { useMemo, useState } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import type { Listing, ListingStatus } from '../../../types/seller';
import ListingsTable from '../../SellerDashboard/ListingsTable';
import { AdminIcons } from '../adminIcons';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

type StatusFilter = 'all' | ListingStatus;

const ListingsSection = React.memo(function ListingsSection() {
  const { data } = useAdminDashboard();
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo<Listing[]>(() => {
    if (!data) return [];
    return data.listings.filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Listings" sub="Review and moderate product listings" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">
              All listings <span className="text-[#737373] font-normal text-[14px]">({data.listings.length})</span>
            </h2>
            <p className="text-[11px] text-[#737373] mt-0.5 mb-0">Flag or remove suspicious listings</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">{AdminIcons.search}</span>
              <input
                type="text"
                placeholder="Search listings…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 border border-[#e6e6e6] rounded-full bg-white text-[14px] text-[#121212] outline-none placeholder:text-[#b3b3b3] focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none h-9 pl-3.5 pr-9 rounded-full border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium cursor-pointer focus:outline-none focus:border-[#ad93e6]"
            >
              <option value="all">All statuses</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>
        <ListingsTable listings={filtered} />
      </div>
    </div>
  );
});

export default ListingsSection;
