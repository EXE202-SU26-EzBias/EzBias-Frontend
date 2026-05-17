import React from 'react';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

const OrdersSection = React.memo(function OrdersSection() {
  return (
    <div>
      <SellerTopbar title="Orders" sub="All orders across the platform" />
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-[rgba(230,230,230,0.5)] rounded-xl">
        <p className="text-[15px] font-semibold text-[#121212] mb-1">Pending API integration</p>
        <p className="text-[13px] text-[#737373]">This section will be available once the admin API is ready.</p>
      </div>
    </div>
  );
});

export default OrdersSection;
