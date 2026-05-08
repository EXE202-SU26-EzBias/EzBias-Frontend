import React from 'react';
import SellerTopbar from '../SellerTopbar';

const OverviewSection = React.memo(function OverviewSection() {
  return (
    <div>
      <SellerTopbar title="Overview" sub="How your store is performing right now" />
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-12 text-center text-[14px] text-[#737373] mb-6">
        Analytics overview coming soon
      </div>
    </div>
  );
});

export default OverviewSection;
