import type { SellerData } from '../../types/seller';

export const fmt = (v: number): string => v.toLocaleString('vi-VN') + ' VNĐ';

export const SELLER_DATA: SellerData = {
  user: { name: 'HYBE Official Store', initials: 'HY', bg: '#9b84ec', role: 'Brand · Verified' },
  kpis: [
    { label: 'Revenue (30d)',   value: '284,500 VNĐ', delta: '+12.4% vs prior', up: true,  icon: 'wallet' },
    { label: 'Orders (30d)',    value: '1,284',        delta: '+8.1% vs prior',  up: true,  icon: 'bag'    },
    { label: 'Listing views',   value: '92.1K',        delta: '+24.6% vs prior', up: true,  icon: 'eye'    },
    { label: 'Conversion rate', value: '3.4%',         delta: '-0.2% vs prior',  up: false, icon: 'spark'  },
  ],
  chart: [
    { label: 'Mon', value: 28 },
    { label: 'Tue', value: 36 },
    { label: 'Wed', value: 42 },
    { label: 'Thu', value: 31 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 71 },
    { label: 'Sun', value: 49 },
  ],
  listings: [
    { id: 'L-1248', name: 'BTS Army Bomb Ver.4',  artist: 'BTS',      price: 59.99,  stock: 12, views: 4120, status: 'live'   },
    { id: 'L-1247', name: 'BTS Proof Album',       artist: 'BTS',      price: 34.99,  stock: 8,  views: 3010, status: 'live'   },
    { id: 'L-1246', name: 'ILLIT 3rd Mini Album',  artist: 'ILLIT',    price: 79.52,  stock: 2,  views: 2280, status: 'live'   },
    { id: 'L-1245', name: 'NewJeans OMG Album',    artist: 'NewJeans', price: 31.99,  stock: 14, views: 5640, status: 'live'   },
    { id: 'L-1244', name: 'BIGBANG Always EP CD',  artist: 'BIGBANG',  price: 14.99,  stock: 0,  views:  890, status: 'out'    },
    { id: 'L-1243', name: 'CORTIS Pin Set',        artist: 'CORTIS',   price: 19.00,  stock: 24, views:  640, status: 'draft'  },
    { id: 'L-1242', name: "HYUKOH '23' Vinyl",     artist: 'HYUKOH',   price: 16.01,  stock: 6,  views:  410, status: 'paused' },
  ],
  orders: [
    { id: '#83214', item: 'BTS Army Bomb Ver.4',  buyer: 'armyforever_94', total: 59.99,  status: 'processing' },
    { id: '#83213', item: 'NewJeans OMG Album',   buyer: 'bunnyhug_2024',  total: 31.99,  status: 'shipped'    },
    { id: '#83212', item: 'ILLIT 3rd Mini Album', buyer: 'illit_lover',    total: 79.52,  status: 'shipped'    },
    { id: '#83211', item: 'BTS Proof Album',      buyer: 'k_collector',    total: 34.99,  status: 'delivered'  },
    { id: '#83210', item: 'Stray Kids 5★★★★★',    buyer: 'stay_2024',      total: 580.00, status: 'delivered'  },
  ],
  auctions: [
    { id: 'AU-04', name: 'BTS Signed MOTS:7',   bid: 450,  bids: 24, end: '1h 59m', status: 'live'  },
    { id: 'AU-03', name: 'NewJeans Bunny Doll',  bid: 195,  bids: 17, end: '0h 44m', status: 'live'  },
    { id: 'AU-02', name: 'BLACKPINK Polaroid',   bid: 880,  bids: 56, end: '—',      status: 'ended' },
    { id: 'AU-01', name: 'BIGBANG Vol. 1 OG',    bid: 2762, bids: 41, end: '—',      status: 'ended' },
  ],
  payouts: [
    { id: 'P-09', date: 'Apr 24, 2026', amount: '12,400 VNĐ', method: 'Wise · ••••8821', status: 'Paid' },
    { id: 'P-08', date: 'Apr 17, 2026', amount: '9,820 VNĐ',  method: 'Wise · ••••8821', status: 'Paid' },
    { id: 'P-07', date: 'Apr 10, 2026', amount: '14,210 VNĐ', method: 'Wise · ••••8821', status: 'Paid' },
  ],
  feed: [
    { who: 'armyforever_94', what: 'placed a bid of',        target: '450 VNĐ',              time: 'Just now',    icon: 'gavel' },
    { who: 'bunnyhug_2024',  what: 'purchased',              target: 'NewJeans OMG Album',   time: '12 min ago',  icon: 'bag'   },
    { who: 'stay_2024',      what: 'left a 5★ review on',    target: 'Stray Kids 5★★★★★',   time: '1 hour ago',  icon: 'star'  },
    { who: 'k_collector',    what: 'asked a question about', target: 'BTS Proof Album',      time: '3 hours ago', icon: 'msg'   },
  ],
};
