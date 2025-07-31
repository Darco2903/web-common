export declare function wait(ms: number): Promise<void>;
export declare function waitFor(condition: () => boolean, timeout?: number, interval?: number): Promise<void>;
export declare function waitForEvent<K extends keyof HTMLElementEventMap>(elem: HTMLElement, type: K): Promise<HTMLElementEventMap[K]>;
export declare function waitForAnim(elem: HTMLElement, animName?: string): Promise<void>;
export declare function waitForAnimIter(elem: HTMLElement, iter: number, animName?: string): Promise<void>;
/**
 * @param {HTMLElement} elem
 */
export declare function waitForTransition(elem: HTMLElement, { propertyName }?: {
    propertyName?: string;
}): Promise<void>;
