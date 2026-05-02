import { Link } from 'react-router-dom';
import OrderSummarySection from '../../components/checkout/OrderSummarySection';
import ShippingSection from '../../components/checkout/ShippingSection';
import PageLayout from '../../components/layout/PageLayout';
import { useCheckoutForm } from '../../features/checkout/useCheckoutForm';
import { useOrderSummary } from '../../features/checkout/useOrderSummary';

const BackArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const CheckoutPage = () => {
  const { items, totals, removeItem } = useOrderSummary();
  const {
    register,
    errors,
    onSubmit,
    selectedPayment,
    setSelectedPayment,
    isReadyToOrder,
    isSubmitting,
  } = useCheckoutForm();

  return (
    <PageLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-10">
        <Link
          to="/fandoms"
          className="mb-6 flex w-fit items-center gap-1.5 text-[13px] text-[#737373] transition-colors hover:text-[#121212]"
        >
          <BackArrowIcon />
          Back to Shop
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9b84ec]">
            <ShoppingBagIcon />
          </div>
          <h1 className="text-[22px] font-bold text-[#121212]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
          <ShippingSection
            register={register}
            errors={errors}
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
            isReadyToOrder={isReadyToOrder}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
          <OrderSummarySection
            items={items}
            totals={totals}
            onRemoveItem={removeItem}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;
