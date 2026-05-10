import { useState, useEffect, useCallback } from 'react';

export function useCountdown(endsAt: string | undefined) {
  const getRemaining = useCallback(() => {
    if (!endsAt) return 0;
    return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
  }, [endsAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    if (!endsAt) return;
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, [endsAt, getRemaining]);

  return {
    hours: Math.floor(remaining / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    secs: remaining % 60,
  };
}
