type DebouncedReturn<T extends (...args: any[]) => any> = {
  debouncedFunction: (...args: Parameters<T>) => void;
  getTimer: () => NodeJS.Timeout | undefined;
};

// export const debounce = <T extends (...args: any[]) => any>(
//   func: T,
//   wait: number = 6000
// ): DebouncedReturn<T> => {
//   let timeout: NodeJS.Timeout | undefined;

//   const debouncedFunction = (...args: Parameters<T>) => {
//     if (timeout) clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       func(...args);
//     }, wait);
//   };
//   const getTimer = () => timeout;
//   return { debouncedFunction, getTimer };
// };

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): [(...args: Parameters<T>) => void, () => NodeJS.Timeout | undefined] => {
  let timeout: NodeJS.Timeout;
  console.log("XXXXXXXXXXXXXXXXX   XXXXXXXXXXXXXX   XXXXXXXXXXXXXXX");
  const debouncedFunction = (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    console.log("YYYYYYYYYVVVYYYYY  YYYYYYYYYYYYY  YYYYYYYYYYYYYYYYYYY");

    timeout = setTimeout(() => {
      console.log(
        "                                              XXXXXXXXXXXXXX   XXXXXXXXXXXXXXX"
      );

      func(...args);
    }, wait);
  };

  const getTimer = (): NodeJS.Timeout | undefined => timeout;
  // Повертаємо масив
  return [debouncedFunction, getTimer];
};

// export const debounce = (func, wait = 6000) => {
//   let timeout;

//   const debouncedFunction = (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       func(...args);
//     }, wait);
//     console.log("timeout timeout timeout", timeout);
//   };

//   const getTimer = () => timeout;

//   return [debouncedFunction, getTimer];
// };
