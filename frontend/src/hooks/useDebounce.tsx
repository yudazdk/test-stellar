import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of a value — updates only after the given delay has elapsed
 * since the last change.
 *
 * @template T - Type of the value to debounce.
 * @param value - Input value to debounce.
 * @param delay - Delay in milliseconds before updating the debounced value (default: 400).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
