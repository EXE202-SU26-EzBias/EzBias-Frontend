import type { AdminData } from '../../types/admin';

export const ADMIN_DATA: AdminData = {
  kpis: [
    { label: 'Platform GMV',     value: '4,280,000 VNĐ', delta: '+18.4% this week', up: true,  icon: 'wallet' },
    { label: 'Total Orders',     value: '3,841',          delta: '+9.2% this week',  up: true,  icon: 'bag'    },
    { label: 'Active Sellers',   value: '124',            delta: '+3 this week',     up: true,  icon: 'eye'    },
    { label: 'Conversion Rate',  value: '4.1%',           delta: '-0.3% this week',  up: false, icon: 'spark'  },
  ],

  chart: [
    { label: 'Mon', value: 420000 },
    { label: 'Tue', value: 580000 },
    { label: 'Wed', value: 710000 },
    { label: 'Thu', value: 490000 },
    { label: 'Fri', value: 800000 },
    { label: 'Sat', value: 750000 },
    { label: 'Sun', value: 620000 },
  ],

  feed: [
    { id: 'f1', who: 'HYBE Store',       what: 'submitted a new listing',        target: 'BTS Map of the Soul',          time: '2 min ago',  icon: 'bag'   },
    { id: 'f2', who: 'user_jk97',         what: 'placed a bid on',                target: 'NewJeans Bunny Doll',          time: '5 min ago',  icon: 'gavel' },
    { id: 'f3', who: 'SMtown Official',   what: 'requested verification for',     target: 'their seller account',         time: '12 min ago', icon: 'star'  },
    { id: 'f4', who: 'user_lisa22',       what: 'reported a listing',             target: 'Suspicious Photocard Bundle',  time: '18 min ago', icon: 'msg'   },
  ],

  orders: [
    { id: '#90001', item: 'BTS Map of the Soul Album',    buyer: 'armyforever_94', total: 350000, status: 'processing' },
    { id: '#90002', item: 'NewJeans Bunny Official Doll', buyer: 'bunnyhug_2024',  total: 480000, status: 'shipped'    },
    { id: '#90003', item: 'aespa My World EP',            buyer: 'aeri_forever',   total: 290000, status: 'delivered'  },
    { id: '#90004', item: 'EXO Universe Photobook',       buyer: 'exo_l_kim',      total: 620000, status: 'shipped'    },
    { id: '#90005', item: 'BLACKPINK The Album',          buyer: 'bp_blink99',     total: 410000, status: 'delivered'  },
  ],

  listings: [
    { id: 'L-2001', name: 'BTS Map of the Soul Album',    artist: 'BTS',       price: 350000, stock: 20, views: 8420,  status: 'live'   },
    { id: 'L-2002', name: 'NewJeans Bunny Official Doll', artist: 'NewJeans',  price: 480000, stock: 5,  views: 12300, status: 'live'   },
    { id: 'L-2003', name: 'aespa My World EP',            artist: 'aespa',     price: 290000, stock: 15, views: 5610,  status: 'live'   },
    { id: 'L-2004', name: 'EXO Universe Photobook',       artist: 'EXO',       price: 620000, stock: 0,  views: 3890,  status: 'out'    },
    { id: 'L-2005', name: 'BLACKPINK The Album',          artist: 'BLACKPINK', price: 410000, stock: 8,  views: 9140,  status: 'paused' },
    { id: 'L-2006', name: 'NCT 127 Kick It Poster Set',   artist: 'NCT 127',   price: 180000, stock: 30, views: 2100,  status: 'draft'  },
  ],

  auctions: [
    { id: 'AU-11', name: 'BTS Signed MOTS:7 LP',        bid: 2800000, bids: 34, end: '2h 15m', status: 'live'  },
    { id: 'AU-12', name: 'NewJeans Bunny Doll Signed',  bid: 950000,  bids: 21, end: '0h 38m', status: 'live'  },
    { id: 'AU-13', name: 'BLACKPINK Autographed CD',    bid: 1600000, bids: 48, end: '—',       status: 'ended' },
    { id: 'AU-14', name: 'EXO Exodus First Press',      bid: 3200000, bids: 62, end: '—',       status: 'ended' },
  ],

  payouts: [
    { id: 'PQ-01', seller: 'HYBE Store',       amount: 1200000, method: 'Wise · ••••8821', requestedAt: 'May 1, 2026',  status: 'pending'  },
    { id: 'PQ-02', seller: 'SMtown Official',  amount: 850000,  method: 'MoMo · ••••4412', requestedAt: 'Apr 30, 2026', status: 'pending'  },
    { id: 'PQ-03', seller: 'YG Merch Store',   amount: 2100000, method: 'Wise · ••••3309', requestedAt: 'Apr 28, 2026', status: 'approved' },
    { id: 'PQ-04', seller: 'Ktown4u Reseller', amount: 420000,  method: 'Bank · ••••9920', requestedAt: 'Apr 27, 2026', status: 'rejected' },
    { id: 'PQ-05', seller: 'FanMerch Asia',    amount: 670000,  method: 'Wise · ••••1147', requestedAt: 'Apr 25, 2026', status: 'approved' },
  ],

  users: [
    { id: 'U-001', name: 'armyforever_94', email: 'army94@mail.com',    role: 'buyer',  status: 'active',    joinedAt: 'Jan 12, 2025', orders: 34 },
    { id: 'U-002', name: 'bunnyhug_2024',  email: 'bunny24@mail.com',   role: 'buyer',  status: 'active',    joinedAt: 'Feb 3, 2025',  orders: 17 },
    { id: 'U-003', name: 'user_jk97',      email: 'jk97@mail.com',      role: 'buyer',  status: 'suspended', joinedAt: 'Mar 8, 2025',  orders: 5  },
    { id: 'U-004', name: 'HYBE Store',     email: 'store@hybe.com',     role: 'seller', status: 'active',    joinedAt: 'Nov 5, 2024',  orders: 0  },
    { id: 'U-005', name: 'user_lisa22',    email: 'lisa22@mail.com',    role: 'buyer',  status: 'suspended', joinedAt: 'Apr 14, 2025', orders: 8  },
    { id: 'U-006', name: 'exo_l_kim',      email: 'exol_kim@mail.com',  role: 'buyer',  status: 'active',    joinedAt: 'Dec 20, 2024', orders: 22 },
  ],

  sellers: [
    { id: 'S-001', name: 'HYBE Store',       email: 'store@hybe.com',      status: 'active',    verified: true,  revenue: 18400000, listings: 24, joinedAt: 'Nov 5, 2024'  },
    { id: 'S-002', name: 'SMtown Official',  email: 'smtown@sm.com',       status: 'pending',   verified: false, revenue: 0,        listings: 3,  joinedAt: 'Apr 28, 2026' },
    { id: 'S-003', name: 'YG Merch Store',   email: 'merch@yg.com',        status: 'active',    verified: true,  revenue: 9200000,  listings: 18, joinedAt: 'Jan 15, 2025' },
    { id: 'S-004', name: 'Ktown4u Reseller', email: 'ktown@resell.com',    status: 'suspended', verified: false, revenue: 2100000,  listings: 7,  joinedAt: 'Feb 22, 2025' },
    { id: 'S-005', name: 'FanMerch Asia',    email: 'fanmerch@asia.com',   status: 'pending',   verified: false, revenue: 0,        listings: 5,  joinedAt: 'May 1, 2026'  },
  ],
};
