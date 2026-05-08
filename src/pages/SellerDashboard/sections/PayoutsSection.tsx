import React from 'react';
import SellerTopbar from '../SellerTopbar';

const PayoutsSection = React.memo(function PayoutsSection() {
  return (
    <div>
      <SellerTopbar title="Payouts" sub="Withdraw earnings and manage payout methods" />

      <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-6 max-[1100px]:grid-cols-1">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#f0edf7] to-[#fcf6e8] border border-[rgba(230,230,230,0.5)]">
          <p className="text-[12px] text-[#737373] m-0">Available balance</p>
          <p className="font-bold text-[32px] tracking-[-1.2px] text-[#121212] my-1.5 mb-4">—</p>
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
              <p className="text-[11px] text-[#737373] m-0">Not configured</p>
            </div>
          </div>
          <button className="mt-3 h-9 px-4 rounded-lg border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium hover:border-[#ad93e6] hover:text-[#ad93e6] transition-colors flex items-center gap-1.5 w-full justify-center">
            Change method
          </button>
        </div>
      </div>

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-12 text-center text-[14px] text-[#737373] mb-6">
        Payout history coming soon
      </div>
    </div>
  );
});

export default PayoutsSection;
