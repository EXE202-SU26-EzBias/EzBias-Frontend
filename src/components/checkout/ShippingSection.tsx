import type { FormEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ShippingFormValues } from '../../types/checkout';
import PlaceOrderButton from './PlaceOrderButton';
import ShippingForm from './ShippingForm';

interface ShippingSectionProps {
  register: UseFormRegister<ShippingFormValues>;
  errors: FieldErrors<ShippingFormValues>;
  isReadyToOrder: boolean;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const ShippingSection = ({
  register,
  errors,
  isReadyToOrder,
  isSubmitting,
  onSubmit,
}: ShippingSectionProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-6">
    <ShippingForm register={register} errors={errors} />
    <PlaceOrderButton isReady={isReadyToOrder} isSubmitting={isSubmitting} />
  </form>
);

export default ShippingSection;
