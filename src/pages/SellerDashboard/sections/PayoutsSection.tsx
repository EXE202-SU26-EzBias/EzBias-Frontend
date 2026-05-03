import React from 'react';
import type { Payout, PayoutStatus } from '../../../types/seller';
import { useSellerDashboard } from '../../../services/seller.service';
import SellerTopbar from '../SellerTopbar';

const payoutStatusBadge: Record<PayoutStatus, string> = {
  Paid:    'bg-[#f0fdf4] text-[#166534]',
  Pending: 'bg-[#fff7ed] text-[#b45309]',
  Failed:  'bg-[#fef2f2] text-[#ef4343]',
};

const PayoutsSection = React.memo(function PayoutsSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="Payouts" sub="Withdraw earnings and manage payout methods" />

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-6 max-[1100px]:grid-cols-1">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#f0edf7] to-[#fcf6e8] border border-[rgba(230,230,230,0.5)]">
          <p className="text-[12px] text-[#737373] m-0">Available balance</p>
          <p className="font-bold text-[32px] tracking-[-1.2px] text-[#121212] my-1.5 mb-4">18,420 VNĐ</p>
          <div className="flex gap-3">
            <button className="flex-1 h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center justify-center gap-1.5">
              Withdraw
            </button>
            <button className="flex-1 h-9 px-4 rounded-lg border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium hover:border-[#ad93e6] hover:text-[#ad93e6] transition-colors flex items-center justify-center gap-1.5">
              Schedule auto
            </button>
          </div>
        </div>

        <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
          <h2 className="text-[16px] font-bold text-[#121212] mt-0 mb-3">Payout method</h2>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgba(230,230,230,0.5)] bg-[rgba(244,243,247,0.4)]">
            <div className="w-9 h-9 rounded-lg bg-[rgba(173,147,230,0.12)] grid place-items-center text-[#7c3aed] font-bold text-[12px]">
              W
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#121212] m-0">Wise</p>
              <p className="text-[11px] text-[#737373] m-0">••••8821</p>
            </div>
          </div>
          <button className="mt-3 h-9 px-4 rounded-lg border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium hover:border-[#ad93e6] hover:text-[#ad93e6] transition-colors flex items-center gap-1.5 w-full justify-center">
            Change method
          </button>
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Payout history</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Past withdrawals</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['ID', 'Date', 'Amount', 'Method', 'Status'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.payouts.map((p: Payout) => (
                <tr key={p.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#737373] align-middle font-medium">
                    {p.id}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle">
                    {p.date}
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle font-semibold">
                    {p.amount}
                  </td>
                  <td className="px-4 py-[14px] text-[#737373] align-middle">
                    {p.method}
                  </td>
                  <td className="px-4 py-[14px] align-middle">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${payoutStatusBadge[p.status]}`}>
                      {p.status}
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

export default PayoutsSection;
