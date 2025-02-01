import * as types from "./types";
export * from "./types";

export const DOMAIN: string;
export const IS_MOBILE: boolean;

export function hasCookie(name: string): boolean;

export function getCookie(name: string): string;

export function createCookie(name: string, value: string, options?: types.Cookie): string;

export function setCookie(name: string, value: string, options?: types.Cookie): void;

export function deleteCookie(
    name: string,
    options?: {
        path?: string;
        domain?: string;
    }
): void;

declare global {
    interface String {
        capitalizeFirstLetter(): string;
    }
}

export function parseSize(size: string, unit?: "B" | "o"): string;
export function parseTime(time: string): types.MinimalTime;

export function wait(ms: number): Promise<void>;

export function waitForEvent<K extends keyof HTMLElementEventMap>(elem: HTMLElement, type: K): Promise<HTMLElementEventMap[K]>;
export function waitForAnim(elem: HTMLElement, animName?: string): Promise<void>;
export function waitForAnimIter(elem: HTMLElement, iter: number, animName?: string): Promise<void>;
export function waitForTransition(elem: HTMLElement, options?: { propertyName?: string }): Promise<void>;
