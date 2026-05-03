import React from 'react';
import type { ChartPoint } from '../../types/seller';

interface RevenueChartProps {
  data: ChartPoint[];
}

const BAR_MAX_HEIGHT_PCT = 92;

const RevenueChart = React.memo(function RevenueChart({ data }: RevenueChartProps) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-[220px] flex items-end gap-3 pt-4">
      {data.map((point) => (
        <div key={point.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div
            className="w-full bg-gradient-to-b from-[#ad93e6] to-[#d6c8f3] rounded-t-lg relative transition-opacity hover:opacity-85"
            style={{ height: `${(point.value / max) * BAR_MAX_HEIGHT_PCT}%` }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#121212] whitespace-nowrap">
              {point.value}
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">{point.label}</span>
        </div>
      ))}
    </div>
  );
});

export default RevenueChart;
