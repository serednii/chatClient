export const debounce = (func, wait = 6000) => {
    let timeout;

    const debouncedFunction = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
        console.log("timeout timeout timeout", timeout);
    };

    const getTimer = () => timeout;

    return [debouncedFunction, getTimer];
};