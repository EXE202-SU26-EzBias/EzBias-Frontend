export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface CreatePaymentPayload {
  orderIds: number[];
}

// Minimal response returned immediately after creating a payment
export interface PaymentResponse {
  paymentId: number;
  reference: string;
  amount: number;
  status: PaymentStatus;
  currency?: string | null;
  createdAt?: string | null;
}

export interface PaymentOrderSummary {
  orderId: number;
  total: number;
  status: number;
  userId: number;
  sellerId: number;
}

// Full detail returned by GET /api/payments/{paymentId}
export interface PaymentDetail extends PaymentResponse {
  paidAt: string | null;
  orderIds: number[];
  orders: PaymentOrderSummary[];
}

export type { PaymentResponse as Payment };
