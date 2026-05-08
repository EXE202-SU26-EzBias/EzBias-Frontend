import React, { useState } from 'react';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';
import {
  getProductConditionLabel,
  getProductStatusColors,
  getProductStatusLabel,
} from '../../constants/product';
import type { SellerProduct } from '../../types/seller';
import { formatCurrency } from '../../utils/formatters';
import { Icons } from './sellerIcons';

interface ListingsTableProps {
  listings: SellerProduct[];
  onEdit?: (listing: SellerProduct) => void;
  onDelete?: (id: number) => void;
}

const ListingsTable = React.memo(function ListingsTable({ listings, onEdit, onDelete }: ListingsTableProps) {
  const [pendingDelete, setPendingDelete] = useState<SellerProduct | null>(null);

  function handleDeleteClick(listing: SellerProduct) {
    setPendingDelete(listing);
  }

  function handleConfirm() {
    if (pendingDelete) onDelete?.(pendingDelete.id);
    setPendingDelete(null);
  }

  function handleCancel() {
    setPendingDelete(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {['Item', 'Condition', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
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
            {listings.map((l) => {
              const statusColors = getProductStatusColors(l.status);
              return (
                <tr
                  key={l.id}
                  className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0"
                >
                  <td className="px-4 py-[14px] text-[#121212] align-middle">
                    <div className="flex items-center gap-2.5 min-w-[220px]">
                      <img
                        src={l.primaryImageUrl}
                        alt={l.name}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-[#f0edf7]"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div>
                        <p className="font-semibold m-0">{l.name}</p>
                        <p className="text-[11px] text-[#737373] m-0">
                          {l.artist} · #{l.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">
                    {getProductConditionLabel(l.condition)}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">{formatCurrency(l.price)}</td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">{l.stock}</td>
                  <td className="px-4 py-[14px] align-middle">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors}`}
                    >
                      {getProductStatusLabel(l.status)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] align-middle">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Edit listing"
                        onClick={() => onEdit?.(l)}
                        className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ad93e6] hover:border-[#ad93e6]"
                      >
                        {Icons.edit}
                      </button>
                      <button
                        type="button"
                        aria-label="Delete listing"
                        onClick={() => handleDeleteClick(l)}
                        className="w-7 h-7 rounded-lg border border-[#e6e6e6] bg-white text-[#737373] grid place-items-center cursor-pointer transition-all hover:text-[#ef4343] hover:border-[#ef4343]"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <ConfirmDeleteModal productName={pendingDelete.name} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
});

export default ListingsTable;
