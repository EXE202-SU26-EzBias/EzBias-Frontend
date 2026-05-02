import React from 'react';
import { Link } from 'react-router-dom';

interface SellerTopbarProps {
  title: string;
  sub: string;
}

const SellerTopbar = React.memo(function SellerTopbar({ title, sub }: SellerTopbarProps) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="text-[24px] font-bold text-[#121212] m-0">{title}</h1>
        <p className="text-[13px] text-[#737373] mt-1 mb-0">{sub}</p>
      </div>
      <Link
        to="/"
        className="text-[13px] font-medium px-4 h-9 rounded-full border border-[#e6e6e6] bg-white text-[#121212] hover:border-[#ad93e6] hover:text-[#ad93e6] transition-all inline-flex items-center"
      >
        ← Back to store
      </Link>
    </div>
  );
});

export default SellerTopbar;
