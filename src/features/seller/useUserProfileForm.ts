import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateUserProfile, useUserProfile } from '../../services/user.service';
import { useUiStore } from '../../stores/ui.store';

const schema = z.object({
  fullName: z.string().min(1, 'Required'),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  zip: z.string(),
  bankName: z.string(),
  bankAccountNumber: z.string(),
  bankAccountName: z.string(),
});

export type UserProfileFormValues = z.infer<typeof schema>;

export function useUserProfileForm() {
  const { data: profile, isLoading, isError } = useUserProfile();
  const { mutate, isPending } = useUpdateUserProfile();
  const showToast = useUiStore((s) => s.showToast);

  // `values` syncs from server on first load only — does not overwrite unsaved edits on background refetch
  const { register, handleSubmit, formState: { errors } } = useForm<UserProfileFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: profile
      ? {
          fullName: profile.fullName ?? '',
          phone: profile.phone ?? '',
          address: profile.address ?? '',
          city: profile.city ?? '',
          zip: profile.zip ?? '',
          bankName: profile.bankName ?? '',
          bankAccountNumber: profile.bankAccountNumber ?? '',
          bankAccountName: profile.bankAccountName ?? '',
        }
      : undefined,
  });

  const onSubmit = handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => showToast('Profile updated successfully.'),
      onError: () => showToast('Failed to update profile. Please try again.'),
    });
  });

  return { register, onSubmit, errors, isPending, isLoading, isError, profile };
}
