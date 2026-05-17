export interface CreateDisputePayload {
  orderId: number;
  reason: string;
  items: CreateDisputeItem[];
}

export interface CreateDisputeItem {
  orderItemId: number;
  requestedQty: number;
  reason: string;
}

export interface DisputeResponse {
  id: number;
  orderId: number;
  userId: number;
  sellerId: number;
  status: number; // e.g. 0 = Open, 1 = Approved, 2 = Rejected
  reason: string;
  details?: string | null;
  createdAt: string;
}

export interface DisputeItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface DisputeDetail extends DisputeResponse {
  items: DisputeItem[];
}

export type { DisputeResponse as Dispute };
