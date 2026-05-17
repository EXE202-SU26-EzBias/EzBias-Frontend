import React from 'react';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

const OverviewSection = React.memo(function OverviewSection() {
  return (
    <div>
      <SellerTopbar title="Platform Overview" sub="Real-time health of the marketplace" />
      <Placeholder />
    </div>
  );
});

function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-[rgba(230,230,230,0.5)] rounded-xl">
      <p className="text-[15px] font-semibold text-[#121212] mb-1">Pending API integration</p>
      <p className="text-[13px] text-[#737373]">This section will be available once the admin API is ready.</p>
    </div>
  );
}

export default OverviewSection;
