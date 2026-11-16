import type { Time } from "@darco2903/secondthought";

export type Cookie = {
    path?: string;
    domain?: string;
    expires?: Date | string;
    maxAge?: number | Time;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    httpOnly?: boolean;
};

/** Whether a cookie with exactly this name exists ("lang" does not match a "language" cookie) */
export function hasCookie(name: string): boolean {
    return getCookie(name) !== undefined;
}

/**
 * The value of the cookie with exactly this name ("lang" does not match a "language" cookie).
 * Everything after the first "=" is returned, so values containing "=" are kept whole.
 */
export function getCookie(name: string): string | undefined {
    return getCookies(name)[0];
}

/**
 * The values of every cookie with exactly this name, in `document.cookie` order. Several cookies
 * can share a name when their domain or path differ (e.g. a host-only one and a parent domain one),
 * the browser lists the most specific path first. Values are returned whole, like `getCookie`.
 */
export function getCookies(name: string): string[] {
    const prefix = name + "=";
    return document.cookie
        .split(/;\s*/)
        .filter((row) => row.startsWith(prefix))
        .map((row) => row.slice(prefix.length));
}

export function createCookie(
    name: string,
    value: string,
    { path, domain, expires, maxAge, secure, sameSite, httpOnly }: Cookie = {},
): string {
    let cookie = `${name}=${value}`;
    if (path) cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (expires) cookie += `;expires=${expires}`;
    if (maxAge !== undefined) {
        const maxAgeSec: number = typeof maxAge === "number" ? maxAge : maxAge.toSecond().time;
        cookie += `;max-age=${maxAgeSec}`;
    }
    if (secure) cookie += `;secure`;
    if (sameSite) cookie += `;samesite=${sameSite}`;
    if (httpOnly) cookie += `;httpOnly`;
    return cookie;
}

export function setCookie(name: string, value: string, options?: Cookie): void {
    document.cookie = createCookie(name, value, options);
}

export function deleteCookie(name: string, options: Cookie = {}): void {
    options.maxAge = 0;
    options.expires = new Date(0).toUTCString();
    setCookie(name, "", options);
}
