import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value. Creates a delayed version of the value that
 * only updates after the specified delay has passed without any new updates.
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional options
 * @param {boolean} options.leading - Whether to update immediately on the leading edge
 * @param {Function} options.onChange - Optional callback when debounced value changes
 * @returns {any} The debounced value
 * 
 * @example
 * // Basic usage
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * // Use in effect
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * 
 * @example
 * // With leading option (immediate first update)
 * const debouncedValue = useDebounce(value, 300, { leading: true });
 * 
 * @example
 * // With onChange callback
 * const debouncedValue = useDebounce(value, 300, { 
 *   onChange: (newValue) => console.log('Debounced value changed:', newValue) 
 * });
 */
export const useDebounce = (value, delay, options = {}) => {
  const { leading = false, onChange = null } = options;
  
  // State for the debounced value
  const [debouncedValue, setDebouncedValue] = useState(leading ? value : undefined);
  
  // Flag to track if this is the first update
  const [isFirstUpdate, setIsFirstUpdate] = useState(true);

  useEffect(() => {
    // Handle the first update with leading edge behavior
    if (isFirstUpdate) {
      if (leading) {
        setDebouncedValue(value);
        if (onChange) onChange(value);
      }
      setIsFirstUpdate(false);
      return;
    }
    
    // Set up the timeout to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (onChange) onChange(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, leading, onChange, isFirstUpdate]);

  return debouncedValue;
};

/**
 * Custom hook to throttle a function call. Ensures that the function is called
 * at most once in the specified interval.
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} delay - The minimum delay between function calls in milliseconds
 * @returns {Function} The throttled function
 * 
 * @example
 * // Throttled scroll handler
 * const throttledHandleScroll = useThrottle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 200);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledHandleScroll);
 *   return () => window.removeEventListener('scroll', throttledHandleScroll);
 * }, [throttledHandleScroll]);
 */
export const useThrottle = (fn, delay) => {
  const [lastCall, setLastCall] = useState(0);

  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      setLastCall(now);
    }
  };
};

export default useDebounce;