export type DepositState =
  | 'PendingPayment'
  | 'Held'
  | 'Applied'
  | 'Forfeited'
  | 'Refunded'
  | 'Failed';

export interface InitiateDepositResponse {
  depositId: number;
  auctionId: number;
  state: DepositState;
  paymentReference: string;
  transferContent: string;
  amountDue: number;
  currency: string;
}

export interface DepositStatus {
  auctionId: number;
  requiredDepositAmount: number;
  hasDeposit: boolean;
  depositId: number | null;
  amount: number | null;
  state: DepositState | null;
  paymentReference: string | null;
}
