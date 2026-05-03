import type { Kpi, ChartPoint, FeedItem, Order, Listing, SellerAuction } from './seller';

export type AdminPageId =
  | 'overview' | 'users' | 'sellers' | 'listings'
  | 'orders' | 'auctions' | 'payouts' | 'analytics';

export type UserRole = 'buyer' | 'seller';
export type UserStatus = 'active' | 'suspended';
export type SellerVerifyStatus = 'active' | 'pending' | 'suspended';
export type PayoutQueueStatus = 'pending' | 'approved' | 'rejected';

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
