let hostname = "";
let isLocalhost = false;
let hasSubdomain = false;
let iSMobile = false;

if (typeof window !== "undefined") {
    hostname = new URL(document.baseURI).hostname;
    isLocalhost = ["localhost", "127.0.0.1"].includes(hostname); // Check if localhost
    hasSubdomain = (hostname.match(/\./g) || []).length > 1;
    iSMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export const DOMAIN = !isLocalhost && hasSubdomain ? hostname.replace(/^[^.]+\./g, "") : hostname; // Remove subdomain
export const IS_MOBILE = iSMobile;
