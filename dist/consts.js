const hostname = new URL(document.baseURI).hostname;
const isLocalhost = !["localhost", "127.0.0.1"].includes(hostname) && (hostname.match(/\./g) || []).length > 1;
export const DOMAIN = isLocalhost ? hostname.replace(/^[^.]+\./g, "") : hostname;
export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
