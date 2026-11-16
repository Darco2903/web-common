import { describe, it, expect, afterEach } from "vitest";
import { createCookie, getCookie, hasCookie, setCookie } from "../../src/index.js";
import { Hour, Minute, Second } from "@darco2903/secondthought";

const EXPIRES = new Date(Date.now() + 1000 * 60 * 60 * 24).toUTCString();

//////////////////////////
// createCookie

describe("createCookie", () => {
    it("should create a cookie string with all options", () => {
        const cookie = createCookie("test", "value", {
            path: "/",
            domain: "example.com",
            expires: EXPIRES,
            maxAge: 86400,
            secure: true,
            sameSite: "Strict",
            httpOnly: true,
        });
        expect(cookie).toBe("test=value;path=/;domain=example.com;expires=" + EXPIRES + ";max-age=86400;secure;samesite=Strict;httpOnly");
    });

    it("should create a cookie string with minimal options", () => {
        const cookie = createCookie("test", "value");
        expect(cookie).toBe("test=value");
    });

    it("should create a cookie string with only the name and value", () => {
        const cookie = createCookie("test", "value");
        expect(cookie).toBe("test=value");
    });

    it("should create a cookie with Time object as maxAge", () => {
        const cookie = createCookie("test", "value", {
            maxAge: new Hour(1),
        });
        expect(cookie).toBe("test=value;max-age=3600");
    });

    it("should create a cookie with Time object as maxAge with operations", () => {
        const cookie = createCookie("test", "value", {
            maxAge: new Minute(10).add(new Second(30)),
        });
        expect(cookie).toBe("test=value;max-age=630");
    });
});

//////////////////////////
// setCookie

describe("setCookie", () => {
    // it("should set a cookie with the given name and value", () => {
    //     setCookie("test1", "value1", {
    //         path: "/",
    //         domain: "example.com",
    //         expires: EXPIRES,
    //         maxAge: 86400,
    //         secure: true,
    //         sameSite: "Strict",
    //         httpOnly: true,
    //     });
    //     console.log(document.cookie);
    //     expect(document.cookie).toContain("test1=value1");
    // });

    it("should set a cookie with minimal options", () => {
        setCookie("test2", "value2");
        console.log(document.cookie);
        expect(document.cookie).toContain("test2=value2");
    });
});

//////////////////////////
// getCookie / hasCookie

/** happy-dom keeps an empty cookie on max-age=0 (browsers remove it), an expires-only write does remove it */
function removeCookie(name: string) {
    document.cookie = `${name}=;expires=${new Date(0).toUTCString()}`;
}

describe("getCookie", () => {
    afterEach(() => {
        for (const name of ["lang", "language", "token", "empty"]) removeCookie(name);
    });

    it("should match the exact name, not a cookie starting with it", () => {
        setCookie("language", "de");
        expect(getCookie("lang")).toBeUndefined();
        setCookie("lang", "fr");
        expect(getCookie("lang")).toBe("fr");
        expect(getCookie("language")).toBe("de");
    });

    it("should not match a name that only ends a cookie name", () => {
        setCookie("language", "de");
        expect(getCookie("guage")).toBeUndefined();
    });

    it("should keep values containing '='", () => {
        setCookie("token", "a=b==");
        expect(getCookie("token")).toBe("a=b==");
    });

    it("should return an empty string for an empty value", () => {
        setCookie("empty", "");
        expect(getCookie("empty")).toBe("");
    });

    it("should return undefined for a missing cookie", () => {
        expect(getCookie("missing")).toBeUndefined();
    });
});

describe("hasCookie", () => {
    afterEach(() => {
        for (const name of ["lang", "language"]) removeCookie(name);
    });

    it("should match the exact name", () => {
        setCookie("language", "de");
        expect(hasCookie("lang")).toBe(false);
        expect(hasCookie("language")).toBe(true);
        setCookie("lang", "fr");
        expect(hasCookie("lang")).toBe(true);
    });

    it("should not match a cookie whose value contains the name", () => {
        setCookie("language", "lang");
        expect(hasCookie("lang")).toBe(false);
    });
});
