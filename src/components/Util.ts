import { IMessage, IParams } from "./interface";

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

export const getNextUserId = (state: IMessage[]): number | undefined => {
  const newState = [...state];
  // console.log("getNextUserId");
  const lastElement: IMessage | undefined = newState.pop();
  if (lastElement?.author === "Admin") {
    return getNextUserId(newState);
  } else {
    return lastElement?.id;
  }
};

export const getPrevUserId = (state: IMessage[]): number | undefined => {
  const newState = [...state];
  // console.log("getNextUserId");
  const lastElement: IMessage | undefined = newState.shift();
  if (lastElement?.author === "Admin") {
    return getPrevUserId(newState);
  } else {
    return lastElement?.id;
  }
};
