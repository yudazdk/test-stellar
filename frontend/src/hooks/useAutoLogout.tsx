import { useEffect, useCallback, useRef } from 'react';

interface AutoLogoutOptions {
  timeoutInMinutes: number;
  onIdle: () => void;
}

/**
 * Hook that triggers `onIdle` after a period of user inactivity.
 *
 * @param options.timeoutInMinutes - Inactivity timeout in minutes.
 * @param options.onIdle - Callback invoked when the timeout elapses.
 * @remarks Listens for mouse/keyboard/scroll/touch events to reset the 
 *          timer and cleans up listeners on unmount.
 */
export const useAutoLogout = ({ timeoutInMinutes, onIdle }: AutoLogoutOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      onIdle();
    }, timeoutInMinutes * 60 * 1000);
  }, [timeoutInMinutes, onIdle]);

  useEffect(() => {
    // Events that indicate the user is active
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Initialize the timer
    resetTimer();

    // Add listeners to reset the timer on activity
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
};