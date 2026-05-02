import { MARQUEE_ITEMS } from '../../constants/landing';

const doubled = [
  ...MARQUEE_ITEMS.map((item, i) => ({ item, key: `a-${i}` })),
  ...MARQUEE_ITEMS.map((item, i) => ({ item, key: `b-${i}` })),
];

const MarqueeStrip = () => (
  <div
    className="overflow-hidden border-y border-[#e6e6e6] bg-[rgba(244,243,247,0.4)] py-3.5"
    aria-hidden="true"
  >
    <div className="flex w-max gap-12 animate-marquee">
      {doubled.map(({ item, key }) => (
        <span
          key={key}
          className="whitespace-nowrap text-[13px] font-medium tracking-[0.2px] text-[#737373]"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeStrip;
