export type AdminPageId =
  | 'overview' | 'users' | 'sellers' | 'listings'
  | 'orders' | 'auctions' | 'payouts' | 'analytics'
  | 'disputes';

export type UserRole = 'buyer' | 'seller';
export type UserStatus = 'active' | 'suspended';
export type SellerVerifyStatus = 'active' | 'pending' | 'suspended';
export type PayoutQueueStatus = 'pending' | 'approved' | 'rejected';

export type ListingStatus = 'live' | 'paused' | 'draft' | 'out';
export type OrderStatus = 'processing' | 'shipped' | 'delivered';
export type AuctionStatus = 'live' | 'ended';

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

export interface FeedItem {
  id: string;
  who: string;
  what: string;
  target: string;
  time: string;
  icon: 'gavel' | 'bag' | 'star' | 'msg';
}

export interface Order {
  id: string;
  item: string;
  buyer: string;
  total: number;
  status: OrderStatus;
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

export interface SellerAuction {
  id: string;
  name: string;
  bid: number;
  bids: number;
  end: string;
  status: AuctionStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  orders: number;
}

export interface AdminSeller {
  id: string;
  name: string;
  email: string;
  status: SellerVerifyStatus;
  verified: boolean;
  revenue: number;
  listings: number;
  joinedAt: string;
}

export interface PayoutQueueItem {
  id: string;
  seller: string;
  amount: number;
  method: string;
  requestedAt: string;
  status: PayoutQueueStatus;
}

export interface AdminData {
  kpis: Kpi[];
  chart: ChartPoint[];
  feed: FeedItem[];
  orders: Order[];
  listings: Listing[];
  auctions: SellerAuction[];
  payouts: PayoutQueueItem[];
  users: AdminUser[];
  sellers: AdminSeller[];
}

export interface AdminDashboardOverviewResponse {
  totalUsers: number;
  newUsersToday: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  returnRequestedOrders: number;
  completedOrders: number;
  canceledOrders: number;
  refundedOrders: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  openDisputes: number;
  pendingRefunds: number;
  pendingPayouts: number;
}
