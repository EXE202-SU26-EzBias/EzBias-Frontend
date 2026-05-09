import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useCart, useClearCart } from '../../services/cart.service';
import { useCreateOrder } from '../../services/order.service';
import { useUiStore } from '../../stores/ui.store';
import type { ShippingFormValues } from '../../types/checkout';

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
  const { mutate: createOrder, isPending } = useCreateOrder();

  const items = cartData?.items ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
  });

  const isReadyToOrder = isValid && items.length > 0;

  const onSubmit = handleSubmit((form) => {
    createOrder(
      {
        source: 'cart',
        cartItemIds: items.map((i) => i.cartItemId),
        addressSnap: {
          fullName: form.fullName,
          phone: form.phoneNumber,
          address: form.address,
          city: form.city,
          zip: form.zipCode,
        },
      },
      {
        onSuccess: (res) => {
          clearCart();
          showToast('Order placed successfully!');
          navigate(`/order-confirmation/${res.id}`);
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
    isReadyToOrder,
    isSubmitting: isPending,
  };
}
