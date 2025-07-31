export async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function waitFor(condition, timeout = 0, interval = 100) {
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
export async function waitForEvent(elem, type) {
    return new Promise((resolve) => {
        elem.addEventListener(type, resolve, { once: true });
    });
}
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
