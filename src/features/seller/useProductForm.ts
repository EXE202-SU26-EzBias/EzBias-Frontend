import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
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

const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 5 * 1024 * 1024, 'Each image must be under 5 MB')
  .refine(
    (f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    'Only JPG, PNG, or WebP allowed',
  );

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
  images: z
    .array(fileSchema)
    .min(1, 'At least one image is required')
    .max(8, 'Maximum 8 images allowed'),
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
      images: [],
    },
  });

  const imageFiles = watch('images');

  const onSubmit = handleSubmit((values) => {
    const payload: ProductPayload = { ...values, images: values.images };
    mutate(payload, {
      onSuccess: () => {
        showToast('Listing created successfully.', 'success');
        onSuccess();
      },
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to create listing. Please try again.';
        showToast(message, 'error');
      },
    });
  });

  return { register, onSubmit, errors, isPending, fandoms, isFandomsLoading, setValue, imageFiles };
}

// ─── Update ──────────────────────────────────────────────────────────────────

const updateSchema = z.object({
  price: z.coerce.number().refine((v) => v > 0, 'Must be greater than 0'),
  stock: z.coerce.number().refine((v) => v >= 0, 'Cannot be negative'),
  description: z.string(),
  status: z.coerce.number().refine((v): v is ProductStatus => [1, 2, 3].includes(v), 'Invalid status'),
  images: z.array(fileSchema).max(8, 'Maximum 8 images allowed').optional(),
  keepImageUrls: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  const total = (data.keepImageUrls?.length ?? 0) + (data.images?.length ?? 0);
  if (total === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one image is required',
      path: ['images'],
    });
  }
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
      images: [],
      keepImageUrls: product.imageUrls?.length
        ? product.imageUrls
        : product.primaryImageUrl
          ? [product.primaryImageUrl]
          : [],
    },
  });

  const imageFiles = watch('images');
  const keepImageUrls = watch('keepImageUrls');

  const onSubmit = handleSubmit((values) => {
    const payload: UpdateProductPayload = {
      price: values.price,
      stock: values.stock,
      description: values.description,
      status: values.status,
      images: values.images,
      keepImageUrls: values.keepImageUrls,
    };
    mutate({ id: product.id, payload }, {
      onSuccess: () => {
        showToast('Listing updated successfully.', 'success');
        onSuccess();
      },
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to update listing. Please try again.';
        showToast(message, 'error');
      },
    });
  });

  return { register, onSubmit, errors, isPending, setValue, imageFiles, keepImageUrls };
}
