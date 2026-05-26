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
  image: z
    .instanceof(File, { message: 'Product image is required' })
    .refine((f) => f.size > 0, 'Product image is required')
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Image must be under 5 MB')
    .refine(
      (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
      'Only JPG, PNG, or WebP allowed',
    ),
});

export type CreateFormValues = z.infer<typeof createSchema>;

export function useCreateProductForm(onSuccess: () => void) {
  const { data: fandoms = [], isLoading: isFandomsLoading } = useFandoms();
  const { mutate, isPending } = useCreateProduct();
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateFormValues>({
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
    },
  });

  const imageFile = watch('image');

  const onSubmit = handleSubmit((values) => {
    const payload: ProductPayload = { ...values, image: values.image };
    mutate(payload, {
      onSuccess: () => {
        showToast('Listing created successfully.', 'success');
        onSuccess();
      },
      onError: () => showToast('Failed to create listing. Please try again.', 'error'),
    });
  });

  return { register, onSubmit, errors, isPending, fandoms, isFandomsLoading, setValue, imageFile };
}

// ─── Update ──────────────────────────────────────────────────────────────────

const updateSchema = z.object({
  price: z.coerce.number().refine((v) => v > 0, 'Must be greater than 0'),
  stock: z.coerce.number().refine((v) => v >= 0, 'Cannot be negative'),
  description: z.string(),
  status: z.coerce.number().refine((v): v is ProductStatus => [1, 2, 3].includes(v), 'Invalid status'),
  image: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, 'Image must be under 5 MB')
    .refine(
      (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
      'Only JPG, PNG, or WebP allowed',
    )
    .optional(),
});

export type UpdateFormValues = z.infer<typeof updateSchema>;

export function useUpdateProductForm(product: SellerProduct, onSuccess: () => void) {
  const { mutate, isPending } = useUpdateProduct();
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema) as Resolver<UpdateFormValues>,
    mode: 'onChange',
    defaultValues: {
      price: product.price,
      stock: product.stock,
      description: product.description,
      status: product.status,
    },
  });

  const imageFile = watch('image');

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateProductPayload = {
      price: values.price,
      stock: values.stock,
      description: values.description,
      status: values.status,
      image: values.image,
    };
    mutate({ id: product.id, payload }, {
      onSuccess: () => {
        showToast('Listing updated successfully.', 'success');
        onSuccess();
      },
      onError: () => showToast('Failed to update listing. Please try again.', 'error'),
    });
  });

  return { register, onSubmit, errors, isPending, setValue, imageFile };
}
