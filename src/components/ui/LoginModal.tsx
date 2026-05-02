import { useState, type FormEvent } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

const LoginModal = () => {
  const { isLoginOpen, closeLogin, showToast } = useUiStore();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isLoginOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuth({
      user: { id: '1', email, name: email.split('@')[0] },
      accessToken: 'demo-token',
    });
    closeLogin();
    showToast("Welcome back! You're now logged in.");
    setEmail('');
    setPassword('');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/45 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="flex w-full max-w-[720px] overflow-hidden rounded-xl bg-[#fcfeff] shadow-[0_4px_28.6px_-4px_rgba(0,0,0,0.16)]"
        style={{ height: 512 }}
      >
        {/* Image panel */}
        <div className="hidden w-[297px] shrink-0 sm:block">
          <img
            src="/background.jpg"
            alt=""
            className="h-full w-full object-cover object-left"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-1 flex-col items-center px-10 py-12"
          style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
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

          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Email</label>
          <input
            type="email"
            required
            placeholder="Enter your Email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />

          <label className="mb-1.5 w-[300px] text-[10px] font-medium text-[#7c838a]">Password</label>
          <input
            type="password"
            required
            placeholder="Enter your Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 h-[32.5px] w-[300px] rounded-[10px] bg-[rgba(176,186,195,0.4)] px-5 text-[10px] text-black/80 outline-none focus:shadow-[0_0_0_2px_rgba(155,132,236,0.4)]"
          />

          <button
            type="submit"
            className="mb-5 mt-2 h-[30px] w-[170px] rounded bg-[#9b84ec] text-[13px] font-medium text-black transition-colors hover:bg-[#8a72db]"
          >
            Login Account
          </button>

          <p className="mb-4 text-[9px] text-[#7c838a]">
            Don&apos;t have a account?{' '}
            <span className="cursor-pointer text-[#9b84ec]">Sign Up</span>
          </p>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="h-[27px] rounded-[7.5px] border border-[#7c838a] bg-white px-2 text-[7px] font-medium text-[#7c838a]"
            >
              G&nbsp;&nbsp;Sign up with Google
            </button>
            <span className="text-[13px] font-medium text-[#b0bac3]">- OR -</span>
            <button
              type="button"
              className="h-[27px] rounded-[7.5px] border border-[#7c838a] bg-white px-2 text-[7px] font-medium text-[#7c838a]"
            >
              f&nbsp;&nbsp;Sign up with Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
