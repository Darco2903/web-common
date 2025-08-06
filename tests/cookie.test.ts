import { describe, it, expect } from "vitest";
import { createCookie, setCookie } from "../src";

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
