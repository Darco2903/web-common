import type { Cookie, MinimalTime } from "./types";

const hostname = new URL(document.baseURI).hostname;
const isLocalhost = !["localhost", "127.0.0.1"].includes(hostname) && (hostname.match(/\./g) || []).length > 1;
export const DOMAIN = isLocalhost ? hostname.replace(/^[^.]+\./g, "") : hostname;
export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const BYTES_UNITS = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

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

String.prototype.capitalizeFirstLetter = function (): string {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
};

Array.prototype.shuffle = function (): void {
    let currentIndex = this.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }
};

export function parseSize(size: number, unit?: "B" | "o"): string {
    let u = 0;
    while (size >= 1024 && u < BYTES_UNITS.length - 1) {
        size /= 1024;
        u++;
    }
    let parsed = size.toFixed(2);
    if (unit) {
        parsed += BYTES_UNITS[u] + unit;
    }
    return parsed;
}

export function parseTime(time: number): MinimalTime {
    return {
        h: ~~(time / 3600),
        m: ~~((time % 3600) / 60),
        s: ~~(time % 60),
    };
}

export async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitFor(condition: () => boolean, timeout: number = 0, interval: number = 100): Promise<void> {
    let t = () => false;

    if (timeout > 0) {
        const start = Date.now();
        t = () => Date.now() - start > timeout;
    }

    while (!condition()) {
        if (t()) {
            throw new Error("Timeout");
        }
        await wait(interval);
    }
}

export async function waitForEvent<K extends keyof HTMLElementEventMap>(elem: HTMLElement, type: K): Promise<HTMLElementEventMap[K]> {
    return new Promise((resolve) => {
        elem.addEventListener(type, resolve, { once: true });
    });
}

export async function waitForAnim(elem: HTMLElement, animName?: string): Promise<void> {
    await new Promise<void>((resolve) => {
        const animHandler = (e: AnimationEvent) => {
            if (!animName || animName === e.animationName) {
                resolve();
                elem.removeEventListener("animationend", animHandler);
            }
        };
        elem.addEventListener("animationend", animHandler);
    });
}

export async function waitForAnimIter(elem: HTMLElement, iter: number, animName?: string): Promise<void> {
    await new Promise<void>((resolve) => {
        if (isNaN(iter)) {
            iter = 0;
        }

        const iterHandler = (e: AnimationEvent) => {
            if (!animName || animName === e.animationName) {
                iter--;
                if (iter <= 0) {
                    resolve();
                    elem.removeEventListener("animationiteration", iterHandler);
                }
            }
        };
        elem.addEventListener("animationiteration", iterHandler);
    });
}

/**
 * @param {HTMLElement} elem
 */
export async function waitForTransition(elem: HTMLElement, { propertyName }: { propertyName?: string } = {}): Promise<void> {
    return new Promise<void>((resolve) => {
        elem.addEventListener("transitionend", (e) => {
            if (!propertyName || propertyName === e.propertyName) {
                resolve();
            }
        });
    });
}
