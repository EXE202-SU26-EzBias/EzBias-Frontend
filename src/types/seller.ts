export type ListingStatus = 'live' | 'paused' | 'draft' | 'out';
export type OrderStatus = 'processing' | 'shipped' | 'delivered';
export type AuctionStatus = 'live' | 'ended';

export interface SellerUser {
  name: string;
  initials: string;
  bg: string;
  role: string;
}

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: 'wallet' | 'bag' | 'eye' | 'spark';
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface Listing {
  id: string;
  name: string;
  artist: string;
  price: number;
  stock: number;
  views: number;
  status: ListingStatus;
}

export interface Order {
  id: string;
  item: string;
  buyer: string;
  total: number;
  status: OrderStatus;
}

export interface Auction {
  id: string;
  name: string;
  bid: number;
  bids: number;
  end: string;
  status: AuctionStatus;
}

export interface Payout {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: string;
}

export interface FeedItem {
  who: string;
  what: string;
  target: string;
  time: string;
  icon: 'gavel' | 'bag' | 'star' | 'msg';
}

export interface SellerData {
  user: SellerUser;
  kpis: Kpi[];
  chart: ChartPoint[];
  listings: Listing[];
  orders: Order[];
  auctions: Auction[];
  payouts: Payout[];
  feed: FeedItem[];
}
