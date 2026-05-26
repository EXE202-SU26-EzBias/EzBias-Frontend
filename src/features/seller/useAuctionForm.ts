import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { useCreateSellerAuction } from '../../services/seller-auction.service';
import { useUiStore } from '../../stores/ui.store';
import type { SellerProduct } from '../../types/seller';

const schema = z.object({
  productId: z.coerce.number().min(1, 'Select a product'),
  floorPrice: z.coerce.number().min(1, 'Must be greater than 0'),
  reservePrice: z.coerce.number().min(0, 'Cannot be negative'),
  endsAt: z.string()
    .min(1, 'Required')
    .refine((val) => new Date(val) > new Date(), { message: 'End time must be in the future' }),
  isUrgent: z.boolean(),
  hasProofImage: z.boolean(),
  extensionSeconds: z.coerce.number().min(0),
  triggerBeforeEnd: z.coerce.number().min(0),
});

export type AuctionFormValues = z.infer<typeof schema>;

interface UseCreateAuctionFormOptions {
  products: SellerProduct[];
  isProductsLoading: boolean;
  onSuccess: () => void;
}

export function useCreateAuctionForm({ products, isProductsLoading, onSuccess }: UseCreateAuctionFormOptions) {
  const { mutate, isPending } = useCreateSellerAuction();
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, formState: { errors } } = useForm<AuctionFormValues>({
    resolver: zodResolver(schema) as Resolver<AuctionFormValues>,
    mode: 'onChange',
    defaultValues: {
      productId: 0,
      floorPrice: 0,
      reservePrice: 0,
      endsAt: '',
      isUrgent: false,
      hasProofImage: false,
      extensionSeconds: 300,
      triggerBeforeEnd: 600,
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, endsAt: new Date(values.endsAt).toISOString() },
      {
        onSuccess,
        onError: () => showToast('Failed to create auction. Please try again.', 'error'),
      },
    );
  });

  return { register, onSubmit, errors, isPending, products, isProductsLoading };
}
