export function hasCookie(name) {
    return document.cookie.includes(name);
}
export function getCookie(name) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        ?.split("=")[1];
}
export function createCookie(name, value, { path, domain, expires, maxAge, secure, sameSite, httpOnly } = {}) {
    let cookie = `${name}=${value}`;
    if (path)
        cookie += `;path=${path}`;
    if (domain)
        cookie += `;domain=${domain}`;
    if (expires)
        cookie += `;expires=${expires}`;
    if (maxAge)
        cookie += `;max-age=${maxAge}`;
    if (secure)
        cookie += `;secure`;
    if (sameSite)
        cookie += `;samesite=${sameSite}`;
    if (httpOnly)
        cookie += `;httpOnly`;
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
