import type { ReactNode } from 'react';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e6e6e6] bg-white px-6 py-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(173,147,230,0.1)]">
      {icon}
    </div>
    <h2 className="text-base font-bold text-[#121212]">{title}</h2>
    <p className="text-sm leading-relaxed text-[#737373]">{description}</p>
  </div>
);

export default FeatureCard;
