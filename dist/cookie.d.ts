export type Cookie = {
    path?: string;
    domain?: string;
    expires?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    httpOnly?: boolean;
};
export declare function hasCookie(name: string): boolean;
export declare function getCookie(name: string): string | undefined;
export declare function createCookie(name: string, value: string, { path, domain, expires, maxAge, secure, sameSite, httpOnly }?: Cookie): string;
export declare function setCookie(name: string, value: string, options?: Cookie): void;
export declare function deleteCookie(name: string, options?: Cookie): void;
