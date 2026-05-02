interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast = ({ message, visible }: ToastProps) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className={[
      'fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-full',
      'bg-[#121212] px-6 py-3 text-sm font-medium text-white',
      'transition-all duration-300 pointer-events-none',
      visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    ].join(' ')}
  >
    {message}
  </div>
);

export default Toast;
