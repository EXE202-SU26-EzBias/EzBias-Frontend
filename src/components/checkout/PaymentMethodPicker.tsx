import { PAYMENT_METHOD_OPTIONS } from '../../constants/checkout';
import type { PaymentMethod } from '../../types/checkout';
import PaymentMethodCard from './PaymentMethodCard';

interface PaymentMethodPickerProps {
  selected: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

const PaymentMethodPicker = ({ selected, onChange }: PaymentMethodPickerProps) => (
  <div>
    <h2 className="mb-3 text-[15px] font-semibold text-[#121212]">Payment Method</h2>
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHOD_OPTIONS.map((option) => (
        <PaymentMethodCard
          key={option.value}
          option={option}
          isSelected={selected === option.value}
          onSelect={onChange}
        />
      ))}
    </div>
  </div>
);

export default PaymentMethodPicker;
