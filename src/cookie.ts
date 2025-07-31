export type Cookie = {
    path?: string;
    domain?: string;
    expires?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    httpOnly?: boolean;
};

export function hasCookie(name: string): boolean {
    return document.cookie.includes(name);
}

export function getCookie(name: string): string | undefined {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
}

export function createCookie(
    name: string,
    value: string,
    { path, domain, expires, maxAge, secure, sameSite, httpOnly }: Cookie = {}
): string {
    let cookie = `${name}=${value}`;
    if (path) cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (expires) cookie += `;expires=${expires}`;
    if (maxAge) cookie += `;max-age=${maxAge}`;
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
