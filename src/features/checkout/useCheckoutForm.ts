import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useCart, useClearCart } from '../../services/cart.service';
import { usePlaceOrder } from '../../services/order.service';
import { useUiStore } from '../../stores/ui.store';
import type { PaymentMethod, ShippingFormValues } from '../../types/checkout';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  zipCode: z.string().min(4, 'Please enter a valid ZIP code'),
  phoneNumber: z.string().min(9, 'Please enter a valid phone number'),
});

export function useCheckoutForm() {
  const navigate = useNavigate();
  const { data: cartData } = useCart();
  const { mutate: clearCart } = useClearCart();
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const items = cartData?.items ?? [];

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
  });

  const isReadyToOrder = isValid && selectedPayment !== null && items.length > 0;

  const onSubmit = handleSubmit((shippingDetails) => {
    if (!selectedPayment) return;

    placeOrder(
      {
        shippingDetails,
        paymentMethod: selectedPayment,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.unitPrice })),
      },
      {
        onSuccess: (res) => {
          clearCart();
          showToast('Order placed successfully!');
          navigate(`/order-confirmation/${res.orderId}`);
        },
        onError: () => {
          showToast('Failed to place order. Please try again.');
        },
      },
    );
  });

  return {
    register,
    errors,
    onSubmit,
    selectedPayment,
    setSelectedPayment,
    isReadyToOrder,
    isSubmitting: isPending,
  };
}
