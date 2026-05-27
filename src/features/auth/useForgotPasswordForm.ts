import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useForgotPassword, useResetPassword } from '../../services/auth.service';
import { useUiStore } from '../../stores/ui.store';

export function useForgotPasswordForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
  const closeForgotPassword = useUiStore((s) => s.closeForgotPassword);
  const openLogin = useUiStore((s) => s.openLogin);
  const showToast = useUiStore((s) => s.showToast);

  const submitEmail = () => {
    if (!email.trim()) { setEmailError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email'); return; }
    setEmailError('');
    forgotPassword({ email }, {
      onSuccess: () => setStep(2),
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Failed to send reset code. Please try again.';
        showToast(message, 'error');
      },
    });
  };

  const submitReset = () => {
    let valid = true;
    if (!code.trim()) { setCodeError('Code is required'); valid = false; } else setCodeError('');
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); valid = false; } else setPasswordError('');
    if (!valid) return;
    resetPassword({ email, code, newPassword }, {
      onSuccess: () => {
        showToast('Password reset successfully. Please log in.', 'success');
        closeForgotPassword();
        openLogin();
      },
      onError: (err) => {
        const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? 'Invalid or expired code. Please try again.';
        showToast(message, 'error');
      },
    });
  };

  return {
    step, email, setEmail, code, setCode, newPassword, setNewPassword,
    emailError, codeError, passwordError,
    submitEmail, submitReset,
    isSending, isResetting,
  };
}
