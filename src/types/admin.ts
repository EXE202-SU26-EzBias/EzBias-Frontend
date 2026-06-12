export type AdminPageId =
  | 'overview'
  | 'users'
  | 'sellers'
  | 'listings'
  | 'orders'
  | 'auctions'
  | 'payouts'
  | 'disputes'
  | 'deposits'
  | 'reviews';

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
  totalReviews: number;
  avgReviewStars: number;
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

// Admin Payout Management Types
// status: 1 = Pending, 2 = Approved, 3 = Rejected
export type PayoutStatus = 1 | 2 | 3;

export interface PayoutOrderSummary {
  id: number;
  userId: number;
  sellerId: number;
  total: number;
  status: number;
  createdAt: string;
}

export interface PayoutSellerSummary {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
  avgSellerRating: number;
  totalRatings: number;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
}

export interface AdminPayoutListItem {
  payoutId: number;
  orderId: number;
  sellerId: number;
  amount: number;
  status: PayoutStatus;
  createdAt: string;
  paidAt: string | null;
  bankTransferRef: string | null;
  order: PayoutOrderSummary;
  seller: PayoutSellerSummary;
}

export interface ApprovePayoutPayload {
  bankTransferRef?: string;
}

export interface RejectPayoutPayload {
  reason: string;
}

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

export interface AdminTransactionItem {
  id: number;
  kind: 'payment' | 'payout' | 'deposit' | 'refund';
  direction: 'in' | 'out';
  amount: number;
  status: string;
  reference: string;
  orderId: number | null;
  buyerUsername: string | null;
  buyerEmail: string | null;
  sellerUsername: string | null;
  sellerEmail: string | null;
  createdAt: string;
  settledAt: string | null;
}

export interface AdminReviewListItem {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  username: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string | null;
}
