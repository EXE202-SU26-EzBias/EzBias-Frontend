import { useForgotPasswordForm } from '../../features/auth/useForgotPasswordForm';
import { useUiStore } from '../../stores/ui.store';

const ForgotPasswordModal = () => {
  const { isForgotPasswordOpen, closeForgotPassword, openLogin } = useUiStore();
  const {
    step, email, setEmail, code, setCode, newPassword, setNewPassword,
    emailError, codeError, passwordError,
    submitEmail, submitReset,
    isSending, isResetting,
  } = useForgotPasswordForm();

  if (!isForgotPasswordOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeForgotPassword();
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/45 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Forgot Password"
    >
      <div className="flex h-[400px] w-full max-w-[720px] overflow-hidden rounded-xl bg-[#fcfeff] shadow-[0_4px_28.6px_-4px_rgba(0,0,0,0.16)]">
        {/* Image panel */}
        <div className="hidden w-[297px] shrink-0 sm:block">
          <img src="/background.jpg" alt="" className="h-full w-full object-cover object-left" />
        </div>

        {/* Form */}
        <div className="relative flex flex-1 flex-col justify-center items-center px-10 py-12 font-sans">
          <button
            type="button"
            onClick={closeForgotPassword}
            className="absolute right-3 top-4 text-lg leading-none text-black"
            aria-label="Close forgot password modal"
          >
            ×
          </button>

          {step === 1 ? (
            <>
              <h2 className="mb-2 text-[13px] font-semibold text-black">Forgot Password</h2>
              <p className="mb-6 w-[300px] text-center text-[10px] text-[#7c838a]">
                Enter your email and we'll send a reset code.
              </p>

              <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
              />
              {emailError && <p className="mb-2 w-[300px] text-[9px] text-red-500">{emailError}</p>}

              <button
                type="button"
                onClick={submitEmail}
                disabled={isSending}
                className="mb-5 mt-4 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db] disabled:opacity-60"
              >
                {isSending ? 'Sending…' : 'Send Code'}
              </button>

              <p className="text-[9px] text-[#7c838a]">
                Remember your password?{' '}
                <span className="cursor-pointer text-[#9b84ec]" onClick={openLogin}>
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-[13px] font-semibold text-black">Reset Password</h2>
              <p className="mb-6 w-[300px] text-center text-[10px] text-[#7c838a]">
                Enter the code sent to <strong>{email}</strong> and your new password.
              </p>

              <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Reset Code</label>
              <input
                type="text"
                placeholder="Enter the code from your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
              />
              {codeError && <p className="mb-2 w-[300px] text-[9px] text-red-500">{codeError}</p>}

              <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
              />
              {passwordError && <p className="mb-2 w-[300px] text-[9px] text-red-500">{passwordError}</p>}

              <button
                type="button"
                onClick={submitReset}
                disabled={isResetting}
                className="mb-5 mt-4 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db] disabled:opacity-60"
              >
                {isResetting ? 'Resetting…' : 'Reset Password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
