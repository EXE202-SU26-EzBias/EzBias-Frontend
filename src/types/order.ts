export interface OrderUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export interface OrderSeller extends OrderUser {
  avgSellerRating: number;
  totalRatings: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDispute {
  id: number;
  status: string;
  adminNote: string | null;
  resolvedAt: string | null;
}

export interface Order {
  id: number;
  userId: number;
  sellerId: number;
  source: number;
  auctionId: number | null;
  paymentId: number | null;
  total: number;
  status: number;
  addressSnap: string;
  carrier: string | null;
  trackingNumber: string | null;
  createdAt: string;
  deliveredAt: string | null;
  user: OrderUser;
  seller: OrderSeller;
  dispute: OrderDispute | null;
  items: OrderItem[];
}
