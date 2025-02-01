import { Cookie, MinimalTime } from "./types.d.ts";
export * from "./types.d.ts";

export const DOMAIN: string;
export const IS_MOBILE: boolean;

export function hasCookie(name: string): boolean;

export function getCookie(name: string): string;

export function createCookie(name: string, value: string, options?: Cookie): string;

export function setCookie(name: string, value: string, options?: Cookie): void;

export function deleteCookie(
    name: string,
    options?: {
        path?: string;
        domain?: string;
    }
): void;

// add capitalizeFirstLetter to String prototype

declare global {
    interface String {
        capitalizeFirstLetter(): string;
    }
}

export function parseSize(size: string, unit?: "B" | "o"): string;
export function parseTime(time: string): MinimalTime;

export function wait(ms: number): Promise<void>;

export async function waitForEvent<K extends keyof HTMLElementEventMap>(elem: HTMLElement, type: K): Promise<HTMLElementEventMap[K]>;
export async function waitForAnim(elem: HTMLElement, animName?: string): Promise<void>;
export async function waitForAnimIter(elem: HTMLElement, iter: number, animName?: string): Promise<void>;
export async function waitForTransition(elem: HTMLElement, options?: { propertyName?: string }): Promise<void>;
