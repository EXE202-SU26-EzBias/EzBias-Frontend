import React from 'react';
import { Icons } from './sellerIcons';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  icon: 'wallet' | 'bag' | 'eye' | 'spark';
}

interface KpiCardProps {
  kpi: Kpi;
}

const iconMap: Record<Kpi['icon'], React.ReactNode> = {
  wallet: Icons.wallet,
  bag: Icons.bag,
  eye: Icons.eye,
  spark: Icons.spark,
};

const KpiCard = React.memo(function KpiCard({ kpi }: KpiCardProps) {
  return (
    <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl p-[18px_20px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="text-[12px] font-semibold text-[#737373] uppercase tracking-[0.6px] flex items-center gap-1.5">
        <span className="text-[#ad93e6]">{iconMap[kpi.icon]}</span>
        {kpi.label}
      </div>
      <div className="font-bold text-[28px] tracking-[-1px] text-[#121212] my-2 leading-none">
        {kpi.value}
      </div>
      <div className={`text-[12px] font-semibold ${kpi.up ? 'text-[#22c55e]' : 'text-[#ef4343]'}`}>
        {kpi.delta}
      </div>
    </div>
  );
});

export default KpiCard;
