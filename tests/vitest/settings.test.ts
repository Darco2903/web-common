import { describe, it, expect, afterEach, vi } from "vitest";
import { DOMAIN, THEMES, getCookie, loadSetting, saveSetting, setCookie } from "../../src/index.js";

const LOCALES = ["en", "fr"] as const;

/** Every string assigned to document.cookie while `fn` runs */
function recordCookieWrites(fn: () => void): string[] {
    const writes: string[] = [];
    const spy = vi.spyOn(document, "cookie", "set").mockImplementation((value: string) => {
        writes.push(value);
    });
    try {
        fn();
    } finally {
        spy.mockRestore();
    }
    return writes;
}

/**
 * happy-dom keeps an empty cookie on max-age=0 (browsers remove it, see deleteCookie),
 * an expires-only write does remove it
 */
function clear() {
    const expires = new Date(0).toUTCString();
    for (const name of ["theme", "lang", "language"]) {
        document.cookie = `${name}=;expires=${expires}`;
        document.cookie = `${name}=;path=/;domain=${DOMAIN};expires=${expires}`;
    }
    localStorage.clear();
}

afterEach(clear);

//////////////////////////
// saveSetting

describe("saveSetting", () => {
    it("should write a cookie on the parent domain for 1 year", () => {
        const writes = recordCookieWrites(() => saveSetting("lang", "fr"));
        expect(writes).toEqual([`lang=fr;path=/;domain=${DOMAIN};max-age=31536000;samesite=Lax`]);
    });

    it("should add secure on https", () => {
        const protocol = vi.spyOn(window.location, "protocol", "get").mockReturnValue("https:");
        try {
            const writes = recordCookieWrites(() => saveSetting("theme", "dark"));
            expect(writes).toEqual([`theme=dark;path=/;domain=${DOMAIN};max-age=31536000;secure;samesite=Lax`]);
        } finally {
            protocol.mockRestore();
        }
    });

    it("should be readable back", () => {
        saveSetting("theme", "light");
        expect(getCookie("theme")).toBe("light");
    });
});

//////////////////////////
// loadSetting

describe("loadSetting", () => {
    it("should return undefined when nothing is saved", () => {
        expect(loadSetting("theme", THEMES)).toBeUndefined();
    });

    it("should return a valid cookie", () => {
        saveSetting("lang", "fr");
        expect(loadSetting("lang", LOCALES)).toBe("fr");
    });

    it("should not read a cookie that only starts with the setting name", () => {
        setCookie("language", "fr");
        expect(loadSetting("lang", LOCALES)).toBeUndefined();
    });

    it("should remove a stale localStorage value when the cookie is valid", () => {
        saveSetting("lang", "fr");
        localStorage.setItem("lang", "en");
        expect(loadSetting("lang", LOCALES)).toBe("fr");
        expect(localStorage.getItem("lang")).toBeNull();
    });

    it("should delete an invalid cookie on the parent domain", () => {
        setCookie("theme", "purple", { path: "/", domain: DOMAIN });
        const writes = recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBeUndefined());
        expect(writes).toHaveLength(1);
        expect(writes[0]).toMatch(new RegExp(`^theme=;path=/;domain=${DOMAIN.replace(/\./g, "\\.")};expires=[^;]+;max-age=0$`));
    });

    it("should migrate a valid localStorage value after deleting an invalid cookie", () => {
        setCookie("theme", "purple", { path: "/", domain: DOMAIN });
        localStorage.setItem("theme", "dark");
        const writes = recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBe("dark"));
        expect(writes).toHaveLength(2);
        expect(writes[0]).toMatch(/^theme=;.*max-age=0$/);
        expect(writes[1]).toBe(`theme=dark;path=/;domain=${DOMAIN};max-age=31536000;samesite=Lax`);
        expect(localStorage.getItem("theme")).toBeNull();
    });

    it("should migrate a valid localStorage value to the cookie once", () => {
        localStorage.setItem("theme", "dark");
        const writes = recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBe("dark"));
        expect(writes).toEqual([`theme=dark;path=/;domain=${DOMAIN};max-age=31536000;samesite=Lax`]);
        expect(localStorage.getItem("theme")).toBeNull();

        // the migrated cookie is read from now on, nothing is written again
        saveSetting("theme", "dark");
        expect(recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBe("dark"))).toEqual([]);
    });

    it("should keep an invalid localStorage value and write nothing", () => {
        localStorage.setItem("lang", "xx");
        const writes = recordCookieWrites(() => expect(loadSetting("lang", LOCALES)).toBeUndefined());
        expect(writes).toEqual([]);
        expect(localStorage.getItem("lang")).toBe("xx");
    });
});
