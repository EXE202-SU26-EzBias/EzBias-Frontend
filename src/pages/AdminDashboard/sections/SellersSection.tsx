import React, { useMemo, useState } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import type { AdminSeller, SellerVerifyStatus } from '../../../types/admin';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';
import { formatCurrency } from '../../../utils/formatters';

const AVATAR_COLORS = ['#9b84ec', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6'];
const avatarColor = (id: string) => AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

const statusBadge: Record<SellerVerifyStatus, string> = {
  active:    'bg-[#f0fdf4] text-[#166534]',
  pending:   'bg-[#fff7ed] text-[#b45309]',
  suspended: 'bg-[#fef2f2] text-[#ef4343]',
};

type TabId = 'all' | 'pending';

const SellersSection = React.memo(function SellersSection() {
  const { data } = useAdminDashboard();
  const [tab, setTab] = useState<TabId>('all');

  const allSellers     = data?.sellers ?? [];
  const pendingSellers = useMemo(() => allSellers.filter((s) => s.status === 'pending'), [allSellers]);
  const displayed      = tab === 'pending' ? pendingSellers : allSellers;

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Seller Management" sub="Verify sellers and manage store access" />

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTab('all')}
          className={`h-9 px-4 rounded-full border text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
            tab === 'all'
              ? 'bg-[#ad93e6] border-[#ad93e6] text-white'
              : 'border-[#e6e6e6] bg-white text-[#121212] hover:border-[#ad93e6] hover:text-[#ad93e6]'
          }`}
        >
          All Sellers <span className="text-[11px] opacity-70">({allSellers.length})</span>
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`h-9 px-4 rounded-full border text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 transition-all ${
            tab === 'pending'
              ? 'bg-[#ad93e6] border-[#ad93e6] text-white'
              : 'border-[#e6e6e6] bg-white text-[#121212] hover:border-[#ad93e6] hover:text-[#ad93e6]'
          }`}
        >
          Pending Verification <span className="text-[11px] opacity-70">({pendingSellers.length})</span>
        </button>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)]">
          <h2 className="text-[16px] font-bold text-[#121212] m-0">
            {tab === 'all' ? 'All Sellers' : 'Verification Queue'}
            <span className="text-[#737373] font-normal text-[14px] ml-1">({displayed.length})</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Seller', 'Status', 'Verified', 'Revenue', 'Listings', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((s: AdminSeller) => (
                <tr key={s.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: avatarColor(s.id) }}
                      >
                        {s.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#121212] m-0 truncate">{s.name}</p>
                        <p className="text-[11px] text-[#737373] m-0 truncate">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[s.status]}`}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    {s.verified
                      ? <span className="text-[#166534] font-bold">✓</span>
                      : <span className="text-[#ef4343] font-bold">✗</span>
                    }
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px] font-semibold">
                    {s.revenue > 0 ? formatCurrency(s.revenue) : '—'}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px]">{s.listings}</td>
                  <td className="px-4 py-[14px] text-[#737373] align-middle text-[13px]">{s.joinedAt}</td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <div className="flex items-center gap-2">
                      {s.status === 'pending' && (
                        <>
                          <button className="h-7 px-3 rounded-lg bg-[#ad93e6] text-white text-[12px] font-medium hover:bg-[#9d7ed9] transition-colors">
                            Approve
                          </button>
                          <button className="h-7 px-3 rounded-lg border border-[#ef4343] text-[#ef4343] text-[12px] font-medium hover:bg-[#fef2f2] transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      {s.status === 'active' && (
                        <button className="h-7 px-3 rounded-lg border border-[#ef4343] text-[#ef4343] text-[12px] font-medium hover:bg-[#fef2f2] transition-colors">
                          Suspend
                        </button>
                      )}
                      {s.status === 'suspended' && (
                        <button className="h-7 px-3 rounded-lg border border-[#166534] text-[#166534] text-[12px] font-medium hover:bg-[#f0fdf4] transition-colors">
                          Activate
                        </button>
                      )}
                    </div>
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

export default SellersSection;
