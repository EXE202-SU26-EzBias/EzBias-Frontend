import { useLoginForm } from '../../features/auth/useLoginForm';
import { useUiStore } from '../../stores/ui.store';

const LoginModal = () => {
  const { isLoginOpen, closeLogin, openRegister } = useUiStore();
  const { register, onSubmit, errors, isPending } = useLoginForm();

  if (!isLoginOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/45 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Login"
    >
      <div className="flex h-[400px] w-full max-w-[720px] overflow-hidden rounded-xl bg-[#fcfeff] shadow-[0_4px_28.6px_-4px_rgba(0,0,0,0.16)]">
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
            onClick={closeLogin}
            className="absolute right-3 top-4 text-lg leading-none text-black"
            aria-label="Close login modal"
          >
            ×
          </button>

          <h2 className="mb-8 text-[13px] font-semibold text-black">Login your Account</h2>

          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Email or Username</label>
          <input
            type="text"
            placeholder="Enter your Email or Username"
            {...register('emailOrUsername')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.emailOrUsername && (
            <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.emailOrUsername.message}</p>
          )}

          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Password</label>
          <input
            type="password"
            placeholder="Enter your Password here"
            {...register('password')}
            className="mb-1 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />
          {errors.password && <p className="mb-2 w-[300px] text-[9px] text-red-500">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="mb-5 mt-2 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db] disabled:opacity-60"
          >
            {isPending ? 'Logging in…' : 'Login Account'}
          </button>

          <p className="mb-4 text-[9px] text-[#7c838a]">
            Don&apos;t have a account?{' '}
            <span className="cursor-pointer text-[#9b84ec]" onClick={openRegister}>
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
