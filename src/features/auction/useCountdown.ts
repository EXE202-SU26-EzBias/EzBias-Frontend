import { useState, useEffect } from 'react';

export function useCountdown(endsAt: string | undefined) {
  const getRemaining = () => {
    if (!endsAt) return 0;
    return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (!endsAt || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(getRemaining());
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return {
    hours: Math.floor(remaining / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    secs: remaining % 60,
  };
}
