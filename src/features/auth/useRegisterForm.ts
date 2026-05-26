import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRegister } from '../../services/auth.service';
import { useUiStore } from '../../stores/ui.store';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const closeRegister = useUiStore((s) => s.closeRegister);
  const openEmailVerification = useUiStore((s) => s.openEmailVerification);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: register_, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((data) => {
    register_(
      { fullName: data.fullName, username: data.username, email: data.email, password: data.password },
      {
        onSuccess: () => {
          closeRegister();
          openEmailVerification(data.email);
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<{ message?: string }>;
          const message = axiosError.response?.data?.message ?? 'Registration failed. Please try again.';
          showToast(message, 'error');
        },
      },
    );
  });

  return { register, onSubmit, errors, isPending };
}
