const hostname = new URL(document.baseURI).hostname;
export const DOMAIN =
    !["localhost", "127.0.0.1"].includes(hostname) && hostname.match(/\./g).length > 1 ? hostname.replace(/^[^.]+\./g, "") : hostname;
export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function hasCookie(name) {
    return document.cookie.includes(name);
}

export function getCookie(name) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
}

/**
 * Sets a cookie
 * @param {string} name
 * @param {string} value
 * @param {object} [#data]
 * @param {string} [#data.path]
 * @param {string} [#data.domain]
 * @param {string} [#data.expires]
 * @param {string} [#data.maxAge]
 * @param {boolean} [#data.secure]
 * @param {string} [#data.samesite]
 * @param {boolean} [#data.httpOnly]
 * @returns {void}
 */
export function setCookie(name, value, data = {}) {
    const { path, domain, expires, maxAge, secure, samesite, httpOnly } = data;
    let cookie = `${name}=${value}`;
    if (path) cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (expires) cookie += `;expires=${expires}`;
    if (maxAge) cookie += `;max-age=${maxAge}`;
    if (secure) cookie += `;secure`;
    if (samesite) cookie += `;samesite=${samesite}`;
    if (httpOnly) cookie += `;httpOnly`;
    document.cookie = cookie;
}

/**
 * Deletes a cookie
 * @param {string} name
 * @param {object} [#data]
 * @param {string} [#data.path]
 * @param {string} [#data.domain]
 * @returns {void}
 */
export function deleteCookie(name, data = {}) {
    data.maxAge = 0;
    data.expires = "Thu, 01 Jan 1970 00:00:00 UTC";
    setCookie(name, "", data);
}

String.prototype.capitalizeFirstLetter = function () {
    return this[0].toUpperCase() + this.slice(1);
};

export function parseSize(size) {
    const units = ["o", "Ko", "Mo", "Go", "To"];
    let unit = 0;
    while (size >= 1024) {
        size /= 1024;
        unit++;
    }
    return size.toFixed(2) + units[unit];
}

export function parseDate(date) {
    return new Date(date).toLocaleString();
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

window.addEventListener("load", async () => {
    document.body.toggleAttribute("mobile", IS_MOBILE);
});
