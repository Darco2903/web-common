const hostname = new URL(document.baseURI).hostname;
const isLocalhost = !["localhost", "127.0.0.1"].includes(hostname) && hostname.match(/\./g).length > 1;
export const DOMAIN = isLocalhost ? hostname.replace(/^[^.]+\./g, "") : hostname;
export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const BYTES_UNITS = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

export function hasCookie(name) {
    return document.cookie.includes(name);
}

export function getCookie(name) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
}

export function createCookie(name, value, { path, domain, expires, maxAge, secure, samesite, httpOnly } = {}) {
    let cookie = `${name}=${value}`;
    if (path) cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (expires) cookie += `;expires=${expires}`;
    if (maxAge) cookie += `;max-age=${maxAge}`;
    if (secure) cookie += `;secure`;
    if (samesite) cookie += `;samesite=${samesite}`;
    if (httpOnly) cookie += `;httpOnly`;
    return cookie;
}

export function setCookie(name, value, options) {
    document.cookie = createCookie(name, value, options);
}

export function deleteCookie(name, options = {}) {
    options.maxAge = 0;
    options.expires = new Date(0).toUTCString();
    setCookie(name, "", options);
}

String.prototype.capitalizeFirstLetter = function () {
    return this[0].toUpperCase() + this.slice(1);
};

export function parseSize(size, unit) {
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

export function parseTime(time) {
    return {
        h: ~~(time / 3600),
        m: ~~((time % 3600) / 60),
        s: ~~(time % 60),
    };
}

export async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {HTMLElement} elem
 */
export async function waitForEvent(elem, type) {
    return new Promise((resolve) => {
        elem.addEventListener(type, resolve, { once: true });
    });
}

/**
 * @param {HTMLElement} elem
 */
export async function waitForAnim(elem, animName) {
    await new Promise((resolve) => {
        const animHandler = (e) => {
            if (!animName || animName === e.animationName) {
                resolve();
                elem.removeEventListener("animationend", animHandler);
            }
        };
        elem.addEventListener("animationend", animHandler);
    });
}

export async function waitForAnimIter(elem, iter, animName) {
    await new Promise((resolve) => {
        if (isNaN(iter)) {
            iter = 0;
        }

        const iterHandler = (e) => {
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
export async function waitForTransition(elem, { propertyName } = {}) {
    return new Promise((resolve) => {
        elem.addEventListener("transitionend", (e) => {
            if (!propertyName || propertyName === e.propertyName) {
                resolve();
            }
        });
    });
}
