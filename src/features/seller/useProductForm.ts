import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import type { ProductStatus } from '../../constants/product';
import { useFandoms } from '../../services/fandom.service';
import {
  useCreateProduct,
  useUpdateProduct,
  type ProductPayload,
  type UpdateProductPayload,
} from '../../services/product.service';
import { useUiStore } from '../../stores/ui.store';
import type { SellerProduct } from '../../types/seller';

// ─── Create ──────────────────────────────────────────────────────────────────

const createSchema = z.object({
  fandomId: z.string().min(1, 'Required'),
  artist: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  condition: z.coerce.number().refine((v) => [1, 2, 3, 4].includes(v), 'Invalid'),
  price: z.coerce.number().refine((v) => v > 0, 'Must be greater than 0'),
  stock: z.coerce.number().refine((v) => v >= 0, 'Cannot be negative'),
  description: z.string(),
  primaryImageUrl: z.string().min(1, 'Required'),
});

export type CreateFormValues = z.infer<typeof createSchema>;

export function useCreateProductForm(onSuccess: () => void) {
  const { data: fandoms = [], isLoading: isFandomsLoading } = useFandoms();
  const { mutate, isPending } = useCreateProduct();
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema) as Resolver<CreateFormValues>,
    mode: 'onChange',
    defaultValues: {
      fandomId: '',
      artist: '',
      name: '',
      type: '',
      condition: 1,
      price: 0,
      stock: 0,
      description: '',
      primaryImageUrl: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    const payload: ProductPayload = { ...values };
    mutate(payload, {
      onSuccess,
      onError: () => showToast('Failed to create listing. Please try again.'),
    });
  });

  return { register, onSubmit, errors, isPending, fandoms, isFandomsLoading };
}

// ─── Update ──────────────────────────────────────────────────────────────────

const updateSchema = z.object({
  price: z.coerce.number().refine((v) => v > 0, 'Must be greater than 0'),
  stock: z.coerce.number().refine((v) => v >= 0, 'Cannot be negative'),
  description: z.string(),
  status: z.coerce.number().refine((v): v is ProductStatus => [1, 2, 3].includes(v), 'Invalid status'),
  primaryImageUrl: z.string().min(1, 'Required'),
});

export type UpdateFormValues = z.infer<typeof updateSchema>;

export function useUpdateProductForm(product: SellerProduct, onSuccess: () => void) {
  const { mutate, isPending } = useUpdateProduct();
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema) as Resolver<UpdateFormValues>,
    mode: 'onChange',
    defaultValues: {
      price: product.price,
      stock: product.stock,
      description: product.description,
      status: product.status,
      primaryImageUrl: product.primaryImageUrl,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateProductPayload = { ...values };
    mutate({ id: product.id, payload }, {
      onSuccess,
      onError: () => showToast('Failed to update listing. Please try again.'),
    });
  });

  return { register, onSubmit, errors, isPending };
}
