import { DOMAIN } from "./consts.js";
import { deleteCookie, getCookie, setCookie } from "./cookie.js";

/**
 * Settings shared by every app of the domain, kept in cookies of the parent domain so a choice
 * made in one app applies to all of them. The names are fixed so every app uses the same cookies.
 */
export type SharedSetting = "theme" | "lang";

export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const MAX_AGE = 365 * 24 * 60 * 60; // 1 year, in seconds

const isBrowser = typeof window !== "undefined";

/** Saves the setting in a cookie of the parent domain, valid for 1 year */
export function saveSetting(name: SharedSetting, value: string): void {
    if (!isBrowser) return;
    setCookie(name, value, {
        path: "/",
        domain: DOMAIN,
        maxAge: MAX_AGE,
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
    });
}

/**
 * The saved value of the setting when it is one of `values`, else `undefined`.
 *
 * The cookie is the source of truth: an invalid cookie is deleted, and localStorage is only read
 * to migrate once the value saved by older app versions (moved to the cookie, then removed).
 */
export function loadSetting<T extends string>(name: SharedSetting, values: readonly T[]): T | undefined {
    if (!isBrowser) return undefined;
    const isValid = (value: string | null | undefined): value is T => values.includes(value as T);

    const cookie = getCookie(name);
    if (isValid(cookie)) {
        // a value left by an older version must not come back if the cookie expires
        localStorage.removeItem(name);
        return cookie;
    }
    if (cookie !== undefined) {
        deleteCookie(name, { path: "/", domain: DOMAIN });
    }

    const stored = localStorage.getItem(name);
    if (isValid(stored)) {
        saveSetting(name, stored);
        localStorage.removeItem(name);
        return stored;
    }
    return undefined;
}
