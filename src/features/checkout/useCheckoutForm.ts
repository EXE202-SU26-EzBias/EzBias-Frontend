import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { http } from '../../lib/axios';
import { queryClient } from '../../lib/queryClient';
import { cartKeys, useCart } from '../../services/cart.service';
import { useUiStore } from '../../stores/ui.store';
import type { CreateOrderPayload, CreateOrderResponse } from '../../types/checkout';
import type { PaymentResponse } from '../../types/payment';
import type { ShippingFormValues } from '../../types/checkout';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a valid city'),
  zipCode: z.string().min(4, 'Please enter a valid ZIP code'),
  phoneNumber: z.string().min(9, 'Please enter a valid phone number'),
});

async function createOrderAndPayment(payload: CreateOrderPayload): Promise<PaymentResponse> {
  const orderRes = await http.post<CreateOrderResponse>('/api/orders', payload).then((r) => r.data);
  const paymentRes = await http
    .post<PaymentResponse>('/api/payments', { orderIds: orderRes.orderIds })
    .then((r) => r.data);
  return paymentRes;
}

export function useCheckoutForm() {
  const navigate = useNavigate();
  const { data: cartData } = useCart();
  const showToast = useUiStore((s) => s.showToast);

  const items = cartData?.items ?? [];

  const { mutate: placeOrder, isPending: isSubmitting } = useMutation({
    mutationFn: createOrderAndPayment,
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      navigate(`/payment/${payment.paymentId}`);
    },
    onError: (err) => {
      const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to place order. Please try again.';
      showToast(message, 'error');
    },
  });

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
    placeOrder({
      items: items.map((i) => ({ cartItemId: i.cartItemId, quantity: i.quantity })),
      addressSnap: {
        fullname: form.fullName,
        phone: form.phoneNumber,
        address: form.address,
        city: form.city,
        zip: form.zipCode,
      },
    });
  });

  return {
    register,
    errors,
    onSubmit,
    isReadyToOrder,
    isSubmitting,
  };
}
