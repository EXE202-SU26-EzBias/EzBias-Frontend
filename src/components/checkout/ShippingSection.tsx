import type { FormEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { PaymentMethod, ShippingFormValues } from '../../types/checkout';
import PaymentMethodPicker from './PaymentMethodPicker';
import PlaceOrderButton from './PlaceOrderButton';
import ShippingForm from './ShippingForm';

interface ShippingSectionProps {
  register: UseFormRegister<ShippingFormValues>;
  errors: FieldErrors<ShippingFormValues>;
  selectedPayment: PaymentMethod | null;
  onPaymentChange: (method: PaymentMethod) => void;
  isReadyToOrder: boolean;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const ShippingSection = ({
  register,
  errors,
  selectedPayment,
  onPaymentChange,
  isReadyToOrder,
  isSubmitting,
  onSubmit,
}: ShippingSectionProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-6">
    <ShippingForm register={register} errors={errors} />
    <PaymentMethodPicker selected={selectedPayment} onChange={onPaymentChange} />
    <PlaceOrderButton isReady={isReadyToOrder} isSubmitting={isSubmitting} />
  </form>
);

export default ShippingSection;
