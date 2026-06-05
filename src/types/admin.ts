export type AdminPageId =
  | 'overview'
  | 'users'
  | 'sellers'
  | 'listings'
  | 'orders'
  | 'auctions'
  | 'payouts'
  | 'analytics'
  | 'disputes'
  | 'deposits';

export interface AdminTopSellerCommission {
  sellerId: number;
  username: string;
  fullName: string;
  orderCount: number;
  grossRevenue: number;
  commissionRevenue: number;
  netRevenue: number;
}

export interface AdminMonthlySalesPoint {
  month: string;   // "yyyy-MM"
  label: string;   // "Jan 2026"
  orderCount: number;
  grossSales: number;
  commissionRevenue: number;
  sellerNetAmount: number;
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
  totalCommissionRevenue: number;
  commissionRevenueToday: number;
  commissionRevenueLast7Days: number;
  commissionRevenueLast30Days: number;
  openDisputes: number;
  pendingRefunds: number;
  pendingPayouts: number;
  topSellersByNetRevenue: AdminTopSellerCommission[];
  monthlySales: AdminMonthlySalesPoint[];
}

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type AdminOverviewNumericKey = NumericKeys<AdminDashboardOverviewResponse>;

// Admin Deposit Management Types
export interface AdminDepositListItem {
  depositId: number;
  auctionId: number;
  auctionTitle: string;
  userId: number;
  userEmail: string;
  userFullName: string;
  amount: number;
  heldAt: string;
  paymentReference: string | null;
}

export interface AdminDepositDetailResponse {
  depositId: number;
  auctionId: number;
  auctionTitle: string;
  auctionStatus: string;
  winnerId: number | null;
  userId: number;
  userEmail: string;
  userFullName: string;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  amount: number;
  state: string;
  heldAt: string;
  paymentId: number | null;
  paymentReference: string | null;
  createdAt: string;
}
