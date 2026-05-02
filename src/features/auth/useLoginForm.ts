import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const closeLogin = useUiStore((s) => s.closeLogin);
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
      },
      onError: () => {
        showToast('Login failed. Please check your credentials.');
      },
    });
  });

  return { register, onSubmit, errors, isPending };
}
