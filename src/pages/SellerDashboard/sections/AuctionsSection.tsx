import React from 'react';
import type { SellerAuction, AuctionStatus } from '../../../types/seller';
import { useSellerDashboard } from '../../../services/seller.service';
import { formatCurrency } from '../../../utils/formatters';
import { Icons } from '../sellerIcons';
import SellerTopbar from '../SellerTopbar';

const statusBadge: Record<AuctionStatus, string> = {
  live:  'bg-[#f0fdf4] text-[#166534]',
  ended: 'bg-[#f0f0f0] text-[#737373]',
};

const statusLabel: Record<AuctionStatus, string> = {
  live:  '● Live',
  ended: 'Ended',
};

const AuctionsSection = React.memo(function AuctionsSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Auctions" sub="Track live and ended auctions you host" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">My auctions</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Live and ended auctions</p>
          </div>
          <button className="h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center gap-1.5">
            {Icons.plus} New auction
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['ID', 'Item', 'Top bid', 'Bids', 'Time left', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.auctions.map((a: SellerAuction) => (
                <tr key={a.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#737373] align-middle font-medium">
                    {a.id}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle font-medium">
                    {a.name}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle font-semibold">
                    {formatCurrency(a.bid)}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">
                    {a.bids}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">
                    {a.end}
                  </td>
                  <td className="px-4 py-[14px] align-middle">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[a.status]}`}>
                      {statusLabel[a.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default AuctionsSection;
