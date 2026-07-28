import { useState, useEffect, useRef } from 'react';

/**
 * useTimer(seconds, onExpire, active)
 *
 * Returns { timeLeft, resetTimer }
 * - timeLeft   : number of seconds remaining
 * - resetTimer : call this to restart the countdown
 * - active     : pass false to pause (e.g. after answer selected)
 */
export default function useTimer(seconds, onExpire, active = true) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  const activeRef   = useRef(active);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { activeRef.current   = active;   }, [active]);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      onExpireRef.current?.();
      return;
    }
    const id = setTimeout(() => {
      if (activeRef.current) {
        setTimeLeft(t => t - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [timeLeft, active]);

  const resetTimer = () => setTimeLeft(seconds);

  return { timeLeft, resetTimer };
}
