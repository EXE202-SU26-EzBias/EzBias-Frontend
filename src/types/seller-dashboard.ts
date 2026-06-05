export interface SellerMonthlySalesPoint {
  month: string;   // "yyyy-MM"
  label: string;   // "Jan 2026"
  itemsSold: number;
  orderCount: number;
  grossRevenue: number;
  commissionPaid: number;
  netRevenue: number;
}

export interface SellerDashboardResponse {
  // Revenue
  grossRevenue: number;
  commissionPaid: number;
  netRevenue: number;

  // Items sold
  itemsSold: number;

  // Orders
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  completedOrders: number;
  canceledOrders: number;

  // Payouts
  pendingPayouts: number;
  paidPayouts: number;
  pendingPayoutAmount: number;
  paidPayoutAmount: number;

  // Auctions
  totalAuctions: number;
  liveAuctions: number;
  soldAuctions: number;

  // Ratings
  avgRating: number;
  totalRatings: number;

  // Monthly trend (last 12 calendar months, oldest first)
  monthlySales: SellerMonthlySalesPoint[];
}
