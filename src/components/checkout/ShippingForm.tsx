import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ShippingFormValues } from '../../types/checkout';
import FormField from './FormField';

interface ShippingFormProps {
  register: UseFormRegister<ShippingFormValues>;
  errors: FieldErrors<ShippingFormValues>;
}

const ShippingForm = ({ register, errors }: ShippingFormProps) => (
  <div>
    <h2 className="mb-4 text-[15px] font-semibold text-[#121212]">Shipping Details</h2>
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Full Name"
          id="fullName"
          placeholder="Kim Namjoon"
          registration={register('fullName')}
          error={errors.fullName?.message}
        />
        <FormField
          label="Email"
          id="email"
          type="email"
          placeholder="you@example.com"
          registration={register('email')}
          error={errors.email?.message}
        />
      </div>
      <FormField
        label="Address"
        id="address"
        placeholder="123 K-Pop Street"
        registration={register('address')}
        error={errors.address?.message}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="City"
          id="city"
          placeholder="Seoul"
          registration={register('city')}
          error={errors.city?.message}
        />
        <FormField
          label="ZIP Code"
          id="zipCode"
          placeholder="06164"
          registration={register('zipCode')}
          error={errors.zipCode?.message}
        />
      </div>
      <FormField
        label="Phone Number"
        id="phoneNumber"
        type="tel"
        placeholder="+82 10 1234 5678"
        registration={register('phoneNumber')}
        error={errors.phoneNumber?.message}
      />
    </div>
  </div>
);

export default ShippingForm;
