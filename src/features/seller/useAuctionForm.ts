import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { useCreateSellerAuction, useRelistSellerAuction } from '../../services/seller-auction.service';
import { useUiStore } from '../../stores/ui.store';
import type { SellerAuction, SellerProduct } from '../../types/seller';

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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AuctionFormValues>({
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
    // The required bid deposit is derived server-side from the floor price; nothing to submit here.
    mutate(
      { ...values, endsAt: new Date(values.endsAt).toISOString() },
      {
        onSuccess,
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to create auction. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  });

  return { register, onSubmit, watch, errors, isPending, products, isProductsLoading };
}

// ─── Relist ──────────────────────────────────────────────────────────────────

const relistSchema = z.object({
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

export type RelistFormValues = z.infer<typeof relistSchema>;

interface UseRelistAuctionFormOptions {
  auction: SellerAuction;
  onSuccess: () => void;
}

// Format a DateTimeOffset string to datetime-local input value (YYYY-MM-DDTHH:mm)
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function useRelistAuctionForm({ auction, onSuccess }: UseRelistAuctionFormOptions) {
  const { mutate, isPending } = useRelistSellerAuction();
  const showToast = useUiStore((s) => s.showToast);

  // Default endsAt: 3 days from now
  const defaultEndsAt = toDatetimeLocal(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RelistFormValues>({
    resolver: zodResolver(relistSchema) as Resolver<RelistFormValues>,
    mode: 'onChange',
    defaultValues: {
      floorPrice: auction.floorPrice,
      reservePrice: 0,
      endsAt: defaultEndsAt,
      isUrgent: false,
      hasProofImage: false,
      extensionSeconds: 300,
      triggerBeforeEnd: 600,
    },
  });

  const onSubmit = handleSubmit((values) => {
    // The required bid deposit is derived server-side from the floor price; nothing to submit here.
    mutate(
      {
        auctionId: auction.auctionId,
        payload: { ...values, endsAt: new Date(values.endsAt).toISOString() },
      },
      {
        onSuccess: () => {
          showToast('Auction relisted successfully.', 'success');
          onSuccess();
        },
        onError: (err) => {
          const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to relist auction.';
          showToast(message, 'error');
        },
      },
    );
  });

  return { register, onSubmit, watch, errors, isPending };
}
