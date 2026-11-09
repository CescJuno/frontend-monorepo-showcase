import { format, parseISO } from 'date-fns';
import { debounce, throttle } from 'lodash';

// Date utilities
export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Debounce and throttle utilities
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => debounce(func, wait) as unknown as T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createThrottle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => throttle(func, wait) as unknown as T;

// Common validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9-+\s()]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};