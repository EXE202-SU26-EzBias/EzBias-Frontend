import { MARQUEE_ITEMS } from '../../constants/landing';

const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

const MarqueeStrip = () => (
  <div
    className="overflow-hidden border-y border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] py-3.5"
    aria-hidden="true"
  >
    <div className="flex w-max gap-12 animate-marquee">
      {doubled.map((item, i) => (
        <span
          key={i}
          className="whitespace-nowrap text-[13px] font-medium tracking-[0.2px] text-[#737373]"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeStrip;
