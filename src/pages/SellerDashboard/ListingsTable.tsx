import React from 'react';
import type { Listing, ListingStatus } from '../../types/seller';
import { Icons } from './sellerIcons';
import { fmt } from './sellerMockData';

interface ListingsTableProps {
  listings: Listing[];
}

const statusBadge: Record<ListingStatus, string> = {
  live:   'bg-[#f0fdf4] text-[#166534]',
  paused: 'bg-[#f0f0f0] text-[#737373]',
  draft:  'bg-[rgba(173,147,230,0.12)] text-[#7c3aed]',
  out:    'bg-[#fef2f2] text-[#ef4343]',
};

const statusLabel: Record<ListingStatus, string> = {
  live:   '● Live',
  paused: 'Paused',
  draft:  'Draft',
  out:    'Out of stock',
};

const ListingsTable = React.memo(function ListingsTable({ listings }: ListingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['Item', 'Price', 'Stock', 'Views', 'Status', 'Actions'].map((h) => (
              <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listings.map((l, idx) => (
            <tr key={l.id} className="hover:bg-[rgba(173,147,230,0.05)]">
              <td className={`px-4 py-[14px] text-[#121212] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                <div className="flex items-center gap-2.5 min-w-[200px]">
                  <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#f0edf7] to-[#fcf6e8] inline-grid place-items-center text-[11px] font-bold text-[#121212]/60 flex-shrink-0">
                    {l.artist.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-semibold m-0">{l.name}</p>
                    <p className="text-[11px] text-[#737373] m-0">{l.id}</p>
                  </div>
                </div>
              </td>
              <td className={`px-4 py-[14px] text-[#121212] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {fmt(l.price)}
              </td>
              <td className={`px-4 py-[14px] text-[#121212] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {l.stock}
              </td>
              <td className={`px-4 py-[14px] text-[#121212] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                {l.views.toLocaleString()}
              </td>
              <td className={`px-4 py-[14px] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[l.status]}`}>
                  {statusLabel[l.status]}
                </span>
              </td>
              <td className={`px-4 py-[14px] align-middle ${idx < listings.length - 1 ? 'border-b border-[rgba(230,230,230,0.5)]' : ''}`}>
                <div className="flex items-center gap-1.5">
                  <button className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ad93e6] hover:border-[#ad93e6]">
                    {Icons.edit}
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ad93e6] hover:border-[#ad93e6]">
                    {Icons.pause}
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ad93e6] hover:border-[#ad93e6]">
                    {Icons.copy}
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ef4343] hover:border-[#ef4343]">
                    {Icons.trash}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ListingsTable;
