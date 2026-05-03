import React, { useState } from 'react';
import { useSellerDashboard } from '../../../services/seller.service';
import SellerTopbar from '../SellerTopbar';

const SettingsSection = React.memo(function SettingsSection() {
  const { data } = useSellerDashboard();
  if (!data) return null;

  const [storeName, setStoreName] = useState(data.user.name);
  const [email, setEmail] = useState(data.user.email ?? '');
  const [about, setAbout] = useState('Official HYBE merchandise store. Authentic K-pop goods from BTS, NewJeans, ILLIT, and more.');

  return (
    <div>
      <SellerTopbar title="Store profile" sub="Public information about your store" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">Store profile</h2>
            <p className="text-[12px] text-[#737373] mt-0.5 mb-0">Visible to buyers on your store page</p>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4 mb-4 max-[700px]:grid-cols-1">
            <div>
              <label htmlFor="store-name" className="text-[11px] text-[#737373] font-medium mb-1 block">
                Store name
              </label>
              <input
                id="store-name"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg text-[13px] text-[#121212] bg-white outline-none focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-[11px] text-[#737373] font-medium mb-1 block">
                Contact email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg text-[13px] text-[#121212] bg-white outline-none focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="store-about" className="text-[11px] text-[#737373] font-medium mb-1 block">
              About your store
            </label>
            <textarea
              id="store-about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[#e6e6e6] rounded-lg text-[13px] text-[#121212] bg-white outline-none focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)] resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button className="h-9 px-4 rounded-lg bg-[#ad93e6] text-white text-[13px] font-semibold hover:bg-[#9d7ed9] transition-colors flex items-center gap-1.5">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SettingsSection;
