import React from 'react';
import { getAuctionStatusColors, getAuctionStatusLabel } from '../../constants/auction';
import type { SellerAuction } from '../../types/seller';
import { formatCurrency } from '../../utils/formatters';

interface AuctionsTableProps {
  auctions: SellerAuction[];
  onPublish: (id: number) => void;
  onCancel: (id: number) => void;
  onRelist: (id: number) => void;
  pendingId: number | null;
}

const AuctionsTable = React.memo(function AuctionsTable({
  auctions,
  onPublish,
  onCancel,
  onRelist,
  pendingId,
}: AuctionsTableProps) {
  if (auctions.length === 0) {
    return <p className="px-5 py-8 text-center text-[14px] text-[#737373]">No auctions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {['Product', 'Floor Price', 'Current Bid', 'Ends At', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {auctions.map((a) => {
            const statusColors = getAuctionStatusColors(a.status);
            const showPublish = a.status === 1;
            const showCancel = a.status === 2 || a.status === 3;
            // Only show relist if auction is in relistable status AND hasn't been relisted yet
            const showRelist = (a.status === 4 || a.status === 6 || a.status === 8) && !a.relistedToAuctionId;

            return (
              <tr
                key={a.auctionId}
                className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0"
              >
                <td className="px-4 py-[14px] align-middle">
                  <div className="flex items-center gap-3">
                    {a.product?.primaryImageUrl ? (
                      <img
                        src={a.product.primaryImageUrl}
                        alt={a.product.name}
                        className="h-11 w-11 shrink-0 rounded-lg border border-[#e6e6e6] object-cover"
                        loading="lazy"
                        width="44"
                        height="44"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#e6e6e6] bg-[#f4f3f7] text-[10px] text-[#b3b3b3]">
                        No img
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#121212] m-0" title={a.product?.name}>
                        {a.product?.name ?? `Product #${a.productId}`}
                      </p>
                      {a.product && (
                        <p className="truncate text-[11px] text-[#737373] m-0">
                          {a.product.artist} · {a.product.type}
                        </p>
                      )}
                      <p className="text-[11px] text-[#b3b3b3] m-0">
                        Auction #{a.auctionId}
                        {a.product ? ` · List ${formatCurrency(a.product.price)} · Stock ${a.product.stock}` : ''}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-[14px] text-[#121212] align-middle">{formatCurrency(a.floorPrice)}</td>
                <td className="px-4 py-[14px] text-[#121212] align-middle">{formatCurrency(a.currentBid)}</td>
                <td className="px-4 py-[14px] text-[#737373] text-[13px] align-middle">
                  {a.endsAt ? new Date(a.endsAt).toLocaleString('vi-VN') : '—'}
                </td>
                <td className="px-4 py-[14px] align-middle">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors}`}>
                    {getAuctionStatusLabel(a.status)}
                  </span>
                </td>
                <td className="px-4 py-[14px] align-middle">
                  <div className="flex items-center gap-1.5">
                    {showPublish && (
                      <button
                        type="button"
                        disabled={pendingId === a.auctionId}
                        onClick={() => onPublish(a.auctionId)}
                        className="h-7 px-2.5 rounded-lg border border-[#e6e6e6] bg-white text-[11px] font-semibold text-[#16a34a] hover:border-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Publish
                      </button>
                    )}
                    {showCancel && (
                      <button
                        type="button"
                        disabled={pendingId === a.auctionId}
                        onClick={() => onCancel(a.auctionId)}
                        className="h-7 px-2.5 rounded-lg border border-[#e6e6e6] bg-white text-[11px] font-semibold text-[#dc2626] hover:border-[#dc2626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    )}
                    {showRelist && (
                      <button
                        type="button"
                        disabled={pendingId === a.auctionId}
                        onClick={() => onRelist(a.auctionId)}
                        className="h-7 px-2.5 rounded-lg border border-[#e6e6e6] bg-white text-[11px] font-semibold text-[#737373] hover:border-[#737373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Relist
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default AuctionsTable;
