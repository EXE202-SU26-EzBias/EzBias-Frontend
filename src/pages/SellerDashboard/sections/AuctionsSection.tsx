import React from 'react';
import SellerTopbar from '../SellerTopbar';

const AuctionsSection = React.memo(function AuctionsSection() {
  return (
    <div>
      <SellerTopbar title="Auctions" sub="Track live and ended auctions you host" />
      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-12 text-center text-[14px] text-[#737373] mb-6">
        Auctions coming soon
      </div>
    </div>
  );
});

export default AuctionsSection;
