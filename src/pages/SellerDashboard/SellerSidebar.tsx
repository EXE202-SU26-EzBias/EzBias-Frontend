import React from 'react';
import type { PageId, SellerUser } from '../../types/seller';
import { Icons } from './sellerIcons';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  pipKey?: 'listings' | 'orders';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { id: 'overview',  label: 'Overview',      icon: Icons.home   },
      { id: 'listings',  label: 'Listings',       icon: Icons.list,  pipKey: 'listings' },
      { id: 'orders',    label: 'Orders',         icon: Icons.bag,   pipKey: 'orders'   },
      { id: 'auctions',  label: 'Auctions',       icon: Icons.gavel  },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics',      icon: Icons.spark  },
      { id: 'payouts',   label: 'Payouts',        icon: Icons.wallet },
    ],
  },
  {
    label: 'Account',
    items: [
      { id: 'settings',  label: 'Store profile',  icon: Icons.cog   },
    ],
  },
];

interface SellerSidebarProps {
  active: PageId;
  onNav: (id: PageId) => void;
  user: SellerUser;
  counts: { listings: number; orders: number };
  isOpen: boolean;
  onClose: () => void;
}

const SellerSidebar = React.memo(function SellerSidebar({ active, onNav, user, counts, isOpen, onClose }: SellerSidebarProps) {
  return (
    <aside className={`w-[240px] bg-white border-r border-[#e6e6e6] px-4 py-5 flex flex-col gap-2 sticky top-0 h-screen overflow-y-auto max-[900px]:fixed max-[900px]:inset-y-0 max-[900px]:left-0 max-[900px]:z-50 max-[900px]:transition-transform ${isOpen ? 'max-[900px]:translate-x-0' : 'max-[900px]:-translate-x-full'}`}>
      <button
        onClick={onClose}
        className="absolute right-3 top-3 max-[900px]:flex hidden w-7 h-7 items-center justify-center rounded-lg border border-[#e6e6e6] text-[#737373] hover:text-[#121212]"
        aria-label="Close navigation"
      >
        ×
      </button>
      <div className="flex items-center gap-2 px-2 pb-4 border-b border-[#e6e6e6] mb-2">
        <img src="/logo.png" alt="EzBias" className="h-9" />
        <small className="text-[10px] text-[#737373] uppercase tracking-[0.6px] font-semibold">
          Seller
        </small>
      </div>

      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#b3b3b3] px-3 pt-4 pb-1.5 m-0">
            {group.label}
          </p>
          {group.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              className={`flex items-center gap-[10px] px-3 py-[10px] rounded-[10px] text-[13px] font-medium cursor-pointer border-none bg-transparent text-left w-full transition-all ${
                active === item.id
                  ? 'bg-[rgba(173,147,230,0.12)] text-[#7c3aed] font-semibold'
                  : 'text-[rgba(18,18,18,0.7)] hover:bg-[rgba(173,147,230,0.05)] hover:text-[#121212]'
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.pipKey !== undefined && (
                <span className="ml-auto bg-[#ad93e6] text-white rounded-full text-[10px] font-bold min-w-[18px] h-[18px] grid place-items-center px-[5px]">
                  {counts[item.pipKey]}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="mt-auto pt-3 border-t border-[#e6e6e6] flex items-center gap-[10px] px-3">
        <div
          className="w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: user.bg }}
        >
          {user.initials}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#121212] m-0 truncate">{user.name}</p>
          <p className="text-[11px] text-[#737373] m-0">{user.role}</p>
        </div>
      </div>
    </aside>
  );
});

export default SellerSidebar;
