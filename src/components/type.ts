import { IParams } from "./interface";
export type THandleChange = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type TDebouncedFunction = (params: IParams) => void;
export type TGetTimer = () => NodeJS.Timeout | undefined;
export type TDebounce = [TDebouncedFunction, TGetTimer];
