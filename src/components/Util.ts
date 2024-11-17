import { IParams } from "./interface";

// type DebouncedReturn<T extends (...args: any[]) => any> = {
//   debouncedFunction: (...args: Parameters<T>) => void;
//   getTimer: () => NodeJS.Timeout | undefined;
// };

export const debounce = <T extends (...args: IParams[]) => any>(
  func: T,
  wait: number
): [(...args: Parameters<T>) => void, () => NodeJS.Timeout | undefined] => {
  let timeout: NodeJS.Timeout;
  const debouncedFunction = (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  const getTimer = (): NodeJS.Timeout | undefined => timeout;
  // Повертаємо масив
  return [debouncedFunction, getTimer];
};
