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

type JarRow = { value: string; domain?: string; path?: string };

/**
 * Runs `fn` against a fake cookie jar holding several cookies of one name (happy-dom keeps one
 * cookie per name, it does not tell a host-only cookie from a parent domain one). A row is keyed
 * by domain and path like in browsers, the rows are listed in jar order. Returns the rows left
 * and every string assigned to document.cookie.
 */
function withCookieJar(name: string, initial: JarRow[], fn: () => void): { rows: JarRow[]; writes: string[] } {
    const rows = initial.map((row) => ({ path: "/", ...row }));
    const writes: string[] = [];
    const get = vi.spyOn(document, "cookie", "get").mockImplementation(() =>
        rows.map((row) => `${name}=${row.value}`).join("; "),
    );
    const set = vi.spyOn(document, "cookie", "set").mockImplementation((cookie: string) => {
        writes.push(cookie);
        const [pair, ...attributes] = cookie.split(";");
        if (!pair.startsWith(name + "=")) return;
        const options = Object.fromEntries(
            attributes.map((attribute) => {
                const eq = attribute.indexOf("=");
                return eq < 0 ? [attribute.toLowerCase(), ""] : [attribute.slice(0, eq).toLowerCase(), attribute.slice(eq + 1)];
            }),
        );
        const domain: string | undefined = options.domain;
        const path: string = options.path ?? "/";
        const index = rows.findIndex((row) => row.domain === domain && row.path === path);
        const removed = options["max-age"] === "0" || (options.expires && new Date(options.expires).getTime() <= Date.now());
        if (removed) {
            if (index >= 0) rows.splice(index, 1);
        } else if (index >= 0) {
            rows[index].value = pair.slice(name.length + 1);
        } else {
            rows.push({ value: pair.slice(name.length + 1), domain, path });
        }
    });
    try {
        fn();
    } finally {
        get.mockRestore();
        set.mockRestore();
    }
    return { rows, writes };
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

    it("should delete an invalid cookie, host-only and on the parent domain", () => {
        setCookie("theme", "purple", { path: "/", domain: DOMAIN });
        const writes = recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBeUndefined());
        expect(writes).toHaveLength(2);
        expect(writes[0]).toMatch(/^theme=;path=\/;expires=[^;]+;max-age=0$/);
        expect(writes[1]).toMatch(new RegExp(`^theme=;path=/;domain=${DOMAIN.replace(/\./g, "\\.")};expires=[^;]+;max-age=0$`));
    });

    it("should migrate a valid localStorage value after deleting an invalid cookie", () => {
        setCookie("theme", "purple", { path: "/", domain: DOMAIN });
        localStorage.setItem("theme", "dark");
        const writes = recordCookieWrites(() => expect(loadSetting("theme", THEMES)).toBe("dark"));
        expect(writes).toHaveLength(3);
        expect(writes[0]).toMatch(/^theme=;.*max-age=0$/);
        expect(writes[1]).toMatch(/^theme=;.*max-age=0$/);
        expect(writes[2]).toBe(`theme=dark;path=/;domain=${DOMAIN};max-age=31536000;samesite=Lax`);
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

describe("loadSetting with several cookies of the same name", () => {
    it("should keep the valid parent domain cookie shadowed by an invalid host-only one", () => {
        localStorage.setItem("theme", "light");
        const { rows } = withCookieJar("theme", [{ value: "bogus" }, { value: "dark", domain: DOMAIN }], () => {
            expect(loadSetting("theme", THEMES)).toBe("dark");
        });
        expect(rows).toEqual([{ value: "dark", domain: DOMAIN, path: "/" }]);
        expect(localStorage.getItem("theme")).toBeNull();
    });

    it("should move a valid host-only cookie to the parent domain over an invalid one", () => {
        const { rows } = withCookieJar("theme", [{ value: "light" }, { value: "purple", domain: DOMAIN }], () => {
            expect(loadSetting("theme", THEMES)).toBe("light");
        });
        expect(rows).toEqual([{ value: "light", domain: DOMAIN, path: "/" }]);
    });

    it("should return the valid value on every load", () => {
        const { rows } = withCookieJar("theme", [{ value: "bogus" }, { value: "dark", domain: DOMAIN }], () => {
            expect(loadSetting("theme", THEMES)).toBe("dark");
            expect(loadSetting("theme", THEMES)).toBe("dark");
        });
        expect(rows).toEqual([{ value: "dark", domain: DOMAIN, path: "/" }]);
    });

    it("should write nothing when every cookie is valid", () => {
        const initial = [{ value: "light" }, { value: "dark", domain: DOMAIN }];
        const { rows, writes } = withCookieJar("theme", initial, () => {
            expect(loadSetting("theme", THEMES)).toBe("light");
        });
        expect(writes).toEqual([]);
        expect(rows).toEqual([
            { value: "light", path: "/" },
            { value: "dark", domain: DOMAIN, path: "/" },
        ]);
    });

    it("should delete every invalid cookie", () => {
        const { rows } = withCookieJar("theme", [{ value: "bogus" }, { value: "purple", domain: DOMAIN }], () => {
            expect(loadSetting("theme", THEMES)).toBeUndefined();
        });
        expect(rows).toEqual([]);
    });

    it("should migrate a valid localStorage value when every cookie is invalid", () => {
        localStorage.setItem("theme", "dark");
        const { rows } = withCookieJar("theme", [{ value: "bogus" }, { value: "purple", domain: DOMAIN }], () => {
            expect(loadSetting("theme", THEMES)).toBe("dark");
        });
        expect(rows).toEqual([{ value: "dark", domain: DOMAIN, path: "/" }]);
        expect(localStorage.getItem("theme")).toBeNull();
    });
});
