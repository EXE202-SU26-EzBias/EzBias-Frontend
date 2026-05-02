import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'live' | 'default';
  dot?: boolean;
  children: ReactNode;
}

const Badge = ({ variant = 'default', dot, children }: BadgeProps) => {
  const isLive = variant === 'live';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.6px] ${
        isLive
          ? 'bg-[rgba(239,67,67,0.12)] text-[#ef4343]'
          : 'bg-[rgba(173,147,230,0.12)] text-[#ad93e6]'
      }`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-[#ef4343] animate-live-pulse' : 'bg-[#ad93e6]'}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
