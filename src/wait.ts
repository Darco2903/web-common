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
