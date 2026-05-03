import React from 'react';
import type { FeedItem } from '../../types/seller';
import { Icons } from './sellerIcons';

interface ActivityFeedProps {
  items: FeedItem[];
}

const feedIconMap: Record<FeedItem['icon'], React.ReactNode> = {
  gavel: Icons.gavel,
  bag: Icons.bag,
  star: Icons.star,
  msg: Icons.msg,
};

const ActivityFeed = React.memo(function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="flex flex-col gap-[14px]">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-[rgba(173,147,230,0.12)] text-[#7c3aed] grid place-items-center flex-shrink-0">
            {feedIconMap[item.icon]}
          </div>
          <div>
            <p className="text-[13px] text-[#121212] leading-[1.4] m-0">
              <span className="font-semibold">{item.who}</span>{' '}
              {item.what}{' '}
              <span className="font-semibold">{item.target}</span>
            </p>
            <p className="text-[11px] text-[#737373] mt-0.5 mb-0">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ActivityFeed;
