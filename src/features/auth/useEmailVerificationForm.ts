import { useState } from 'react';
import { useRequestEmailVerification, useVerifyEmail } from '../../services/auth.service';
import { useUiStore } from '../../stores/ui.store';

export function useEmailVerificationForm() {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const email = useUiStore((s) => s.pendingVerificationEmail);
  const closeEmailVerification = useUiStore((s) => s.closeEmailVerification);
  const showToast = useUiStore((s) => s.showToast);

  const { mutate: requestVerification, isPending: isResending } = useRequestEmailVerification();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();

  const resendCode = () => {
    requestVerification({ email }, {
      onSuccess: () => showToast('Verification code resent.', 'success'),
      onError: () => showToast('Failed to resend code. Please try again.', 'error'),
    });
  };

  const submitVerify = () => {
    if (!code.trim()) { setCodeError('Code is required'); return; }
    setCodeError('');
    verifyEmail({ email, code }, {
      onSuccess: () => {
        showToast('Email verified successfully!', 'success');
        closeEmailVerification();
      },
      onError: () => showToast('Invalid or expired code. Please try again.', 'error'),
    });
  };

  return { email, code, setCode, codeError, submitVerify, resendCode, isVerifying, isResending };
}
