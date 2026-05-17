import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SepayQRCard from '../../components/payment/SepayQRCard';
import PaymentStatusBadge from '../../components/payment/PaymentStatusBadge';
import PageLayout from '../../components/layout/PageLayout';
import { useManualConfirmPayment, usePaymentDetail } from '../../services/payment.service';
import { useUiStore } from '../../stores/ui.store';

const PaymentPage = () => {
  const { paymentId: paymentIdParam } = useParams<{ paymentId: string }>();
  const paymentId = Number(paymentIdParam);
  const navigate = useNavigate();
  const showToast = useUiStore((s) => s.showToast);

  useEffect(() => {
    if (!Number.isFinite(paymentId) || paymentId <= 0) {
      navigate('/checkout', { replace: true });
    }
  }, [paymentId, navigate]);

  const { data, isLoading, isError } = usePaymentDetail(paymentId, { polling: true });
  const { mutate: manualConfirm, isPending: isConfirming } = useManualConfirmPayment();

  const status = data?.status;
  const isPaid = status === 'Paid';
  const isFailed = status === 'Failed';

  useEffect(() => {
    if (isPaid) {
      const targetId = data?.orderIds[0];
      if (targetId) {
        navigate(`/order-confirmation/${targetId}`, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isPaid, data, navigate]);

  const handleManualConfirm = () => {
    manualConfirm(paymentId, {
      onSuccess: () => showToast('Payment confirmed manually.'),
      onError: () => showToast('Could not confirm payment. Please contact support.'),
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e6e6e6] border-t-[#ad93e6]" />
        </div>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <p className="text-[15px] text-[#737373]">Could not load payment details.</p>
          <Link to="/checkout" className="text-[13px] text-[#9b84ec] underline">
            Back to checkout
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (isFailed) {
    return (
      <PageLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-[20px] font-bold text-[#121212]">Payment Failed</h1>
          <p className="text-[14px] text-[#737373]">Your payment could not be processed.</p>
          <Link
            to="/checkout"
            className="rounded-xl bg-[#9b84ec] px-8 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#8a72db]"
          >
            Try Again
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-[600px] px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-[22px] font-bold text-[#121212]">Complete Your Payment</h1>
          <p className="text-[14px] text-[#737373]">
            Scan the QR code or transfer to the account below. The page updates automatically.
          </p>
        </div>

        <SepayQRCard amount={data.amount} reference={data.reference} />

        <div className="mt-6 flex flex-col items-center gap-4">
          <PaymentStatusBadge status={data.status} />

          <p className="text-center text-[12px] text-[#b0bac3]">
            Checking every 5 seconds — do not close this tab until confirmed.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/checkout"
            className="rounded-xl border border-[#e6e6e6] px-6 py-2.5 text-center text-[13px] font-medium text-[#737373] transition-colors hover:border-[#c8b8f4] hover:text-[#9b84ec]"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleManualConfirm}
            disabled={isConfirming}
            className="rounded-xl bg-[#f5f3ff] px-6 py-2.5 text-[13px] font-semibold text-[#9b84ec] transition-all hover:bg-[rgba(155,132,236,0.15)] disabled:opacity-50"
          >
            {isConfirming ? 'Confirming…' : 'I already paid'}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentPage;
