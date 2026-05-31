import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useDepositStatus, useInitiateDeposit } from '../../services/deposit.service';
import type { InitiateDepositResponse } from '../../types/deposit';
import { formatCurrency } from '../../utils/formatters';
import SepayQRCard from '../payment/SepayQRCard';

interface DepositPanelProps {
  auctionId: number;
  isLive: boolean;
}

const CARD = 'rounded-2xl border border-[#e6e6e6] bg-white p-4';
const TRANSFER_NOTE = "After your transfer is confirmed, you'll be able to bid.";

const DepositPanel = ({ auctionId, isLive }: DepositPanelProps) => {
  const { data: status, isLoading } = useDepositStatus(auctionId);
  const { mutate: initiate, isPending } = useInitiateDeposit(auctionId);
  const [initiated, setInitiated] = useState<InitiateDepositResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Still loading the initial status — show a compact placeholder.
  if (isLoading && !status) {
    return <p className="text-xs text-[#737373]">Checking deposit status…</p>;
  }

  // Legacy / no-deposit auctions: nothing to render.
  if (!status || status.requiredDepositAmount <= 0) {
    return null;
  }

  const state = status.state;

  const handlePay = () => {
    setError(null);
    initiate(undefined, {
      onSuccess: (res) => setInitiated(res),
      onError: (err) => {
        const message =
          (err as AxiosError<{ message?: string }>).response?.data?.message
          ?? 'Failed to start the deposit. Please try again.';
        setError(message);
      },
    });
  };

  // No active deposit yet, or a previous attempt failed — allow paying (again).
  if (!status.hasDeposit || state === 'Failed') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#121212]">Deposit required</p>
        <p className="mt-1 text-xs leading-5 text-[#737373]">
          A deposit of {formatCurrency(status.requiredDepositAmount)} is required to place bids on this auction.
        </p>
        <button
          type="button"
          onClick={handlePay}
          disabled={!isLive || isPending}
          className="mt-3 inline-flex h-9 items-center rounded-lg bg-[#ad93e6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9d7ed9] disabled:opacity-60"
        >
          {isPending ? 'Starting…' : 'Pay deposit'}
        </button>
        {error && <p className="mt-2 text-xs text-[#dc2626]">{error}</p>}
        {initiated && (
          <div className="mt-4 flex flex-col gap-3">
            <SepayQRCard amount={initiated.amountDue} reference={initiated.paymentReference} />
            <p className="text-[11px] text-[#737373]">{TRANSFER_NOTE}</p>
          </div>
        )}
      </div>
    );
  }

  if (state === 'PendingPayment') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#121212]">Deposit pending payment</p>
        {status.paymentReference && status.amount != null ? (
          <div className="mt-3 flex flex-col gap-3">
            <SepayQRCard amount={status.amount} reference={status.paymentReference} />
            <p className="text-[11px] text-[#737373]">{TRANSFER_NOTE}</p>
          </div>
        ) : (
          <p className="mt-1 text-xs leading-5 text-[#737373]">Waiting for your transfer to be confirmed.</p>
        )}
      </div>
    );
  }

  if (state === 'Held') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#16a34a]">Deposit confirmed — you can place bids.</p>
        <p className="mt-1 text-xs leading-5 text-[#737373]">
          {formatCurrency(status.amount ?? status.requiredDepositAmount)} is held against this auction.
        </p>
      </div>
    );
  }

  if (state === 'Applied') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#121212]">Your deposit was applied to your winning payment.</p>
      </div>
    );
  }

  if (state === 'Refunded') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#121212]">Your deposit has been refunded.</p>
      </div>
    );
  }

  if (state === 'Forfeited') {
    return (
      <div className={CARD}>
        <p className="text-sm font-semibold text-[#121212]">Your deposit was forfeited.</p>
      </div>
    );
  }

  return null;
};

export default DepositPanel;
