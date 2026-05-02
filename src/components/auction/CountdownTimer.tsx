interface CountdownTimerProps {
  hours: number;
  minutes: number;
  secs: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

const CountdownTimer = ({ hours, minutes, secs }: CountdownTimerProps) => (
  <div className="flex items-center gap-1 font-mono text-base font-bold text-[#121212]">
    <span className="rounded-lg bg-[#f4f3f7] px-2.5 py-1.5">{pad(hours)}</span>
    <span className="text-[#737373]">:</span>
    <span className="rounded-lg bg-[#f4f3f7] px-2.5 py-1.5">{pad(minutes)}</span>
    <span className="text-[#737373]">:</span>
    <span className="rounded-lg bg-[#f4f3f7] px-2.5 py-1.5">{pad(secs)}</span>
  </div>
);

export default CountdownTimer;
