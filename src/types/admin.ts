export type AdminPageId =
  | 'overview'
  | 'users'
  | 'sellers'
  | 'listings'
  | 'orders'
  | 'auctions'
  | 'payouts'
  | 'analytics'
  | 'disputes';

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

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type AdminOverviewNumericKey = NumericKeys<AdminDashboardOverviewResponse>;
