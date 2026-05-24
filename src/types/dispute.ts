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

export interface RefundPayoutInfo {
  buyerId: number;
  buyerFullName: string;
  buyerEmail: string;
  buyerPhone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface DisputeItem {
  id: number;
  orderItemId: number;
  productName: string;
  orderedQty: number;
  unitPrice: number;
  requestedQty: number;
  approvedQty: number | null;
  note: string;
}

export interface DisputeResponse {
  id: number;
  orderId: number;
  initiatorId: number;
  status: import('../constants/dispute').DisputeStatusValue;
  reason: string;
  adminNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  refundPayoutInfo: RefundPayoutInfo | null;
  items: DisputeItem[];
}

export interface ApprovedItem {
  orderItemId: number;
  approvedQty: number;
  note: string;
}

export interface ApproveDisputePayload {
  adminNote: string;
  approvedItems: ApprovedItem[];
}

export interface RejectDisputePayload {
  reason: string;
}

