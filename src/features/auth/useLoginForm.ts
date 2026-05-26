import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AxiosError } from 'axios';
import { useLogin } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;

const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Email or username is required')
    .refine(
      (value) => z.string().email().safeParse(value).success || usernameRegex.test(value),
      'Please enter a valid email or username',
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const closeLogin = useUiStore((s) => s.closeLogin);
  const openEmailVerification = useUiStore((s) => s.openEmailVerification);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((data) => {
    login(data, {
      onSuccess: (res) => {
        setAuth(res);
        closeLogin();
        showToast(`Welcome back, ${res.user.username}!`, 'success');
      },
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? '';
        if (message.toLowerCase().includes('not verified')) {
          const email = z.string().email().safeParse(data.emailOrUsername).success
            ? data.emailOrUsername
            : '';
          openEmailVerification(email);
        } else {
          showToast('Login failed. Please check your credentials.', 'error');
        }
      },
    });
  });

  return { register, onSubmit, errors, isPending };
}
