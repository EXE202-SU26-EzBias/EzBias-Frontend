import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import { useCreateReview, useUpdateReview } from '../../services/review.service';
import { useUiStore } from '../../stores/ui.store';
import type { ProductReview } from '../../types/review';

const reviewSchema = z.object({
  stars: z.number().int().min(1, 'Please select a rating').max(5),
  comment: z.string().max(1000, 'Comment must be 1000 characters or fewer').optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export function useReviewForm(productId: number, existingReview: ProductReview | null) {
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: createReview, isPending: isCreating } = useCreateReview(productId);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(productId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: 'onChange',
    defaultValues: {
      stars: existingReview?.stars ?? 0,
      comment: existingReview?.comment ?? '',
    },
  });

  useEffect(() => {
    reset({
      stars: existingReview?.stars ?? 0,
      comment: existingReview?.comment ?? '',
    });
  }, [existingReview, reset]);

  const stars = watch('stars');

  const setStars = (value: number) =>
    setValue('stars', value, { shouldValidate: true, shouldDirty: true });

  const onSubmit = handleSubmit((data) => {
    const payload = { stars: data.stars, comment: data.comment?.trim() || null };
    const onError = (err: unknown) => {
      const message =
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
        'Could not save your review. Please try again.';
      showToast(message, 'error');
    };

    if (existingReview) {
      updateReview(
        { reviewId: existingReview.id, payload },
        {
          onSuccess: () => showToast('Review updated.', 'success'),
          onError,
        },
      );
    } else {
      createReview(payload, {
        onSuccess: () => showToast('Thanks for your review!', 'success'),
        onError,
      });
    }
  });

  return {
    register,
    onSubmit,
    errors,
    stars,
    setStars,
    isPending: isCreating || isUpdating,
    isEditing: Boolean(existingReview),
  };
}
