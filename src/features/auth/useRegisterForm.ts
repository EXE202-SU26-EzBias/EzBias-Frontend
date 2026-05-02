import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const closeRegister = useUiStore((s) => s.closeRegister);
  const showToast = useUiStore((s) => s.showToast);
  const { mutate: register_, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit((data) => {
    register_({ fullName: data.fullName, email: data.email, password: data.password }, {
      onSuccess: (res) => {
        setAuth(res);
        closeRegister();
        showToast('Account created successfully!');
      },
      onError: () => {
        showToast('Registration failed. Please try again.');
      },
    });
  });

  return { register, onSubmit, errors, isPending };
}
