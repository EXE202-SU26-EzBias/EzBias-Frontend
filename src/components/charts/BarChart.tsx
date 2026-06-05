import React, { useId, useMemo, useState } from 'react';

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

export interface BarChartDatum {
  /** Short axis label, e.g. "Jan" */
  label: string;
  /** Optional richer label for tooltips, e.g. "Jan 2026" */
  fullLabel?: string;
  /** value per series key */
  values: Record<string, number>;
}

interface BarChartProps {
  data: BarChartDatum[];
  series: BarSeries[];
  height?: number;
  /** Format a value for the tooltip + y-axis (e.g. currency or counts) */
  formatValue?: (n: number) => string;
  /** Compact y-axis tick formatter; falls back to formatValue */
  formatTick?: (n: number) => string;
  /** Show the legend row above the chart */
  showLegend?: boolean;
  ariaLabel?: string;
}

const PAD = { top: 16, right: 16, bottom: 34, left: 56 };
const GRID_LINES = 4;

function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

/**
 * Responsive grouped/single bar chart drawn as inline SVG.
 * Scales to its container width via viewBox; no external chart lib.
 */
const BarChart = React.memo(function BarChart({
  data,
  series,
  height = 280,
  formatValue = (n) => n.toLocaleString(),
  formatTick,
  showLegend = true,
  ariaLabel = 'Bar chart',
}: BarChartProps) {
  const gradId = useId();
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

  const width = 720; // viewBox width; SVG stretches to container
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;

  const maxVal = useMemo(() => {
    let m = 0;
    for (const d of data) for (const s of series) m = Math.max(m, d.values[s.key] ?? 0);
    return niceMax(m);
  }, [data, series]);

  const tickFmt = formatTick ?? formatValue;
  const groupW = data.length > 0 ? innerW / data.length : innerW;
  const barGap = 4;
  const groupInnerW = groupW * 0.7;
  const barW = series.length > 0 ? Math.max(2, (groupInnerW - barGap * (series.length - 1)) / series.length) : groupInnerW;

  const yFor = (v: number) => PAD.top + innerH - (maxVal > 0 ? (v / maxVal) * innerH : 0);

  const gridVals = Array.from({ length: GRID_LINES + 1 }, (_, i) => (maxVal / GRID_LINES) * i);

  // Label thinning so the x-axis never overcrowds.
  const labelEvery = data.length > 12 ? Math.ceil(data.length / 12) : 1;

  const hovered = hover ? data[hover.i] : null;

  return (
    <div className="relative w-full">
      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: s.color }} />
              <span className="text-[12px] text-[#737373]">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          {series.map((s, idx) => (
            <linearGradient key={s.key} id={`${gradId}-${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.65" />
            </linearGradient>
          ))}
        </defs>

        {/* Gridlines + y-axis ticks */}
        {gridVals.map((gv, i) => {
          const y = yFor(gv);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={width - PAD.right} y2={y} stroke="#eef0f2" strokeWidth={1} />
              <text x={PAD.left - 8} y={y + 3} textAnchor="end" className="fill-[#9ca3af]" style={{ fontSize: 10 }}>
                {tickFmt(gv)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const groupX = PAD.left + i * groupW + (groupW - groupInnerW) / 2;
          const isLabelShown = i % labelEvery === 0;
          return (
            <g key={i}>
              {/* hover hit area spanning the whole group */}
              <rect
                x={PAD.left + i * groupW}
                y={PAD.top}
                width={groupW}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover({ i, x: groupX + groupInnerW / 2, y: PAD.top })}
                onMouseLeave={() => setHover((h) => (h?.i === i ? null : h))}
              />
              {hover?.i === i && (
                <rect
                  x={PAD.left + i * groupW}
                  y={PAD.top}
                  width={groupW}
                  height={innerH}
                  fill="rgba(173,147,230,0.06)"
                  pointerEvents="none"
                />
              )}
              {series.map((s, sIdx) => {
                const v = d.values[s.key] ?? 0;
                const barH = PAD.top + innerH - yFor(v);
                const x = groupX + sIdx * (barW + barGap);
                return (
                  <rect
                    key={s.key}
                    x={x}
                    y={yFor(v)}
                    width={barW}
                    height={Math.max(0, barH)}
                    rx={Math.min(3, barW / 2)}
                    fill={`url(#${gradId}-${sIdx})`}
                    pointerEvents="none"
                  />
                );
              })}
              {isLabelShown && (
                <text
                  x={groupX + groupInnerW / 2}
                  y={height - PAD.bottom + 16}
                  textAnchor="middle"
                  className="fill-[#9ca3af]"
                  style={{ fontSize: 10 }}
                >
                  {d.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={PAD.left} y1={PAD.top + innerH} x2={width - PAD.right} y2={PAD.top + innerH} stroke="#d1d5db" strokeWidth={1} />
      </svg>

      {/* Tooltip */}
      {hovered && hover && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-[rgba(230,230,230,0.8)] bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
          style={{
            left: `${(hover.x / width) * 100}%`,
            top: 8,
            transform: 'translateX(-50%)',
            minWidth: 120,
          }}
        >
          <p className="text-[11px] font-semibold text-[#121212] mb-1">{hovered.fullLabel ?? hovered.label}</p>
          {series.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-[#737373]">
                <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="text-[11px] font-semibold text-[#121212]">{formatValue(hovered.values[s.key] ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default BarChart;
