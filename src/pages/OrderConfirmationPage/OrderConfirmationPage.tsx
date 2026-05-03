import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <PageLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-[480px] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(155,132,236,0.12)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b84ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="mb-2 text-[22px] font-bold text-[#121212]">Order Placed!</h1>
        <p className="mb-1 text-[14px] text-[#737373]">Thank you for your purchase.</p>
        {orderId && (
          <p className="mb-8 text-[12px] text-[#b0bac3]">
            Order ID: <span className="font-mono text-[#9b84ec]">{orderId}</span>
          </p>
        )}

        <Link
          to="/fandoms"
          className="rounded-xl bg-[#9b84ec] px-8 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#8a72db]"
        >
          Continue Shopping
        </Link>
      </div>
    </PageLayout>
  );
};

export default OrderConfirmationPage;
