export type NotificationType =
  | 'Outbid'
  | 'AuctionWon'
  | 'AuctionExpired'
  | 'AuctionEndingSoon'
  | 'OrderPlaced'
  | 'OrderShipped'
  | 'OrderDelivered'
  | 'OrderConfirmed'
  | 'PayoutPaid'
  | 'DisputeOpened'
  | 'DisputeResolved'
  | 'UserVerified'
  | 'DepositConfirmed'
  | 'DepositRefundInitiated'
  | 'DepositForfeited';

export interface NotificationMeta {
  orderId?: number;
  auctionId?: number;
  disputeId?: number;
  payoutId?: number;
  minutesLeft?: number;
}

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  meta: string; // JSON string
  isRead: boolean;
  createdAt: string;
  readAt?: string | null;
}
