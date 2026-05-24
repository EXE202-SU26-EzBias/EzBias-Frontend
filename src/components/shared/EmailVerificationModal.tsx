import { useEmailVerificationForm } from '../../features/auth/useEmailVerificationForm';
import { useUiStore } from '../../stores/ui.store';

const EmailVerificationModal = () => {
  const { isEmailVerificationOpen, closeEmailVerification } = useUiStore();
  const { email, code, setCode, codeError, submitVerify, resendCode, isVerifying, isResending } = useEmailVerificationForm();

  if (!isEmailVerificationOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Email Verification"
    >
      <div className="flex h-[360px] w-full max-w-[720px] overflow-hidden rounded-xl bg-[#fcfeff] shadow-[0_4px_28.6px_-4px_rgba(0,0,0,0.16)]">
        {/* Image panel */}
        <div className="hidden w-[297px] shrink-0 sm:block">
          <img src="/background.jpg" alt="" className="h-full w-full object-cover object-left" />
        </div>

        {/* Form */}
        <div className="relative flex flex-1 flex-col justify-center items-center px-10 py-12 font-sans">
          <button
            type="button"
            onClick={closeEmailVerification}
            className="absolute right-3 top-4 text-lg leading-none text-black"
            aria-label="Close email verification modal"
          >
            ×
          </button>


          <h2 className="mb-2 text-[13px] font-semibold text-black">Verify Your Email</h2>
          <p className="mb-6 w-[300px] text-center text-[10px] text-[#7c838a]">
            A verification code was sent to <strong>{email}</strong>. Enter it below to activate your account.
          </p>

          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Verification Code</label>
          <input
            type="text"
            placeholder="Enter the code from your email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {codeError && <p className="mb-2 w-[300px] text-[9px] text-red-500">{codeError}</p>}

          <button
            type="button"
            onClick={submitVerify}
            disabled={isVerifying}
            className="mb-4 mt-4 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db] disabled:opacity-60"
          >
            {isVerifying ? 'Verifying…' : 'Verify Email'}
          </button>

          <p className="text-[9px] text-[#7c838a]">
            Didn't receive a code?{' '}
            <span
              className={`cursor-pointer text-[#9b84ec] ${isResending ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={resendCode}
            >
              {isResending ? 'Sending…' : 'Resend'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
