import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import { useCreateReview, useUpdateReview } from '../../services/review.service';
import { useUiStore } from '../../stores/ui.store';
import type { ProductReview, ReviewMediaType } from '../../types/review';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export interface PendingReviewMedia {
  id: string;
  file: File;
  url: string;
  type: ReviewMediaType;
}

const reviewSchema = z.object({
  stars: z.number().int().min(1, 'Please select a rating').max(5),
  comment: z.string().max(1000, 'Comment must be 1000 characters or fewer').optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export function useReviewForm(
  productId: number,
  existingReview: ProductReview | null,
  onSaved?: () => void,
) {
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: createReview, isPending: isCreating } = useCreateReview(productId);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(productId);
  const [newMedia, setNewMedia] = useState<PendingReviewMedia[]>([]);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const mediaSelectionKey = existingReview
    ? `${existingReview.id}:${existingReview.updatedAt ?? existingReview.createdAt}:${existingReview.media.map((media) => media.id).join(',')}`
    : 'new';
  const defaultKeptMediaIds = existingReview?.media.map((media) => media.id) ?? [];
  const [mediaSelection, setMediaSelection] = useState({
    key: mediaSelectionKey,
    keptIds: defaultKeptMediaIds,
  });
  const keptMediaIds = mediaSelection.key === mediaSelectionKey
    ? mediaSelection.keptIds
    : defaultKeptMediaIds;
  const previewUrls = useRef(new Set<string>());

  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    },
    [],
  );

  const stars = useWatch({ control, name: 'stars' });

  const setStars = (value: number) =>
    setValue('stars', value, { shouldValidate: true, shouldDirty: true });

  const addMedia = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessingMedia(true);
    try {
      const keptMedia = existingReview?.media.filter((media) => keptMediaIds.includes(media.id)) ?? [];
      const additions: PendingReviewMedia[] = [];
      let imageCount = keptMedia.filter((media) => media.type === 'image').length
        + newMedia.filter((media) => media.type === 'image').length;
      let videoCount = keptMedia.filter((media) => media.type === 'video').length
        + newMedia.filter((media) => media.type === 'video').length;

      for (const file of files) {
        if (!ALLOWED_TYPES.has(file.type)) {
          showToast('Only JPEG, PNG, WEBP, MP4, WEBM, or MOV files are allowed.', 'error');
          continue;
        }

        const type: ReviewMediaType = file.type.startsWith('image/') ? 'image' : 'video';
        if (type === 'image' && file.size > MAX_IMAGE_BYTES) {
          showToast('Each image must be 5MB or smaller.', 'error');
          continue;
        }
        if (type === 'video' && file.size > MAX_VIDEO_BYTES) {
          showToast('The video must be 50MB or smaller.', 'error');
          continue;
        }
        if (keptMedia.length + newMedia.length + additions.length >= 6) {
          showToast('A review can contain at most 6 media files.', 'error');
          break;
        }
        if (type === 'image' && imageCount >= 5) {
          showToast('A review can contain at most 5 images.', 'error');
          continue;
        }
        if (type === 'video' && videoCount >= 1) {
          showToast('A review can contain at most 1 video.', 'error');
          continue;
        }

        const url = URL.createObjectURL(file);
        previewUrls.current.add(url);
        if (type === 'video') {
          const duration = await getVideoDuration(url);
          if (duration > 60) {
            URL.revokeObjectURL(url);
            previewUrls.current.delete(url);
            showToast('The video must be 60 seconds or shorter.', 'error');
            continue;
          }
          videoCount += 1;
        } else {
          imageCount += 1;
        }

        additions.push({ id: crypto.randomUUID(), file, url, type });
      }

      if (additions.length > 0) setNewMedia((current) => [...current, ...additions]);
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const removeNewMedia = (id: string) => {
    setNewMedia((current) => {
      const removed = current.find((media) => media.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
        previewUrls.current.delete(removed.url);
      }
      return current.filter((media) => media.id !== id);
    });
  };

  const toggleExistingMedia = (id: number) => {
    setMediaSelection({
      key: mediaSelectionKey,
      keptIds: keptMediaIds.includes(id)
        ? keptMediaIds.filter((mediaId) => mediaId !== id)
        : [...keptMediaIds, id],
    });
  };

  const resetMediaSelection = () => {
    setNewMedia((current) => {
      current.forEach((media) => {
        URL.revokeObjectURL(media.url);
        previewUrls.current.delete(media.url);
      });
      return [];
    });
    setMediaSelection({ key: mediaSelectionKey, keptIds: defaultKeptMediaIds });
  };

  const onSubmit = handleSubmit((data) => {
    const payload = {
      stars: data.stars,
      comment: data.comment?.trim() || null,
      media: newMedia.map((media) => media.file),
    };
    const onError = (err: unknown) => {
      const message =
        (err as AxiosError<{ message?: string }>).response?.data?.message ??
        'Could not save your review. Please try again.';
      showToast(message, 'error');
    };

    if (existingReview) {
      updateReview(
        { reviewId: existingReview.id, payload: { ...payload, keepMediaIds: keptMediaIds } },
        {
          onSuccess: () => {
            resetMediaSelection();
            showToast('Review updated.', 'success');
            onSaved?.();
          },
          onError,
        },
      );
    } else {
      createReview(payload, {
        onSuccess: () => {
          resetMediaSelection();
          showToast('Thanks for your review!', 'success');
          onSaved?.();
        },
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
    isPending: isCreating || isUpdating || isProcessingMedia,
    isEditing: Boolean(existingReview),
    newMedia,
    keptMediaIds,
    addMedia,
    removeNewMedia,
    toggleExistingMedia,
    resetMediaSelection,
  };
}

function getVideoDuration(url: string) {
  return new Promise<number>((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => resolve(Number.isFinite(video.duration) ? video.duration : 0);
    video.onerror = () => resolve(0);
    video.src = url;
  });
}
