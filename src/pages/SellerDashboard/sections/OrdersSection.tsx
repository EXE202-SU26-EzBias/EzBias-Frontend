import React from 'react';
import SellerTopbar from '../SellerTopbar';

const OrdersSection = React.memo(function OrdersSection() {
  return (
    <div>
      <SellerTopbar title="Orders" sub="Process and ship customer orders" />
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-12 text-center text-[14px] text-[#737373] mb-6">
        Orders coming soon
      </div>
    </div>
  );
});

export default OrdersSection;
