import { useRegisterForm } from '../../features/auth/useRegisterForm';
import { useUiStore } from '../../stores/ui.store';

const RegisterModal = () => {
  const { isRegisterOpen, closeRegister, openLogin } = useUiStore();
  const { register, onSubmit, errors, isPending } = useRegisterForm();

  if (!isRegisterOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeRegister();
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/45 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Register"
    >
      <div className="flex h-[520px] w-full max-w-[720px] overflow-hidden rounded-xl bg-[#fcfeff] shadow-[0_4px_28.6px_-4px_rgba(0,0,0,0.16)]">
        {/* Image panel */}
        <div className="hidden w-[297px] shrink-0 sm:block">
          <img src="/background.jpg" alt="" className="h-full w-full object-cover object-left" />
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="relative flex flex-1 flex-col justify-center items-center px-10 py-12 font-sans"
        >
          <button
            type="button"
            onClick={closeRegister}
            className="absolute right-3 top-4 text-lg leading-none text-black"
            aria-label="Close register modal"
          >
            ×
          </button>

          <h2 className="mb-6 text-[13px] font-semibold text-black">Create your Account</h2>

          {/* Full Name */}
          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Full Name</label>
          <input
            type="text"
            placeholder="Enter your Full Name here"
            {...register('fullName')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.fullName && <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.fullName.message}</p>}

          {/* UserName */}
          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Username</label>
          <input
            type="text"
            placeholder="Enter your Username here"
            {...register('username')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.username && <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.username.message}</p>}

          {/* Email */}
          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Email</label>
          <input
            type="email"
            placeholder="Enter your Email here"
            {...register('email')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.email && <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.email.message}</p>}

          {/* Password */}
          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Password</label>
          <input
            type="password"
            placeholder="Enter your Password here"
            {...register('password')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.password && <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.password.message}</p>}

          {/* Confirm Password */}
          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your Password"
            {...register('confirmPassword')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.confirmPassword && (
            <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mb-5 mt-3 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db] disabled:opacity-60"
          >
            {isPending ? 'Creating…' : 'Create Account'}
          </button>

          <p className="mb-2 text-[9px] text-[#7c838a]">
            By creating an account, you agree to our{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9b84ec] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-[9px] text-[#7c838a]">
            Already have an account?{' '}
            <span className="cursor-pointer text-[#9b84ec]" onClick={openLogin}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
