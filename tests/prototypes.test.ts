import { describe, it, expect } from "vitest";
import "../src";

//////////////////////////
// capitalizeFirstLetter

describe("String.prototype.capitalizeFirstLetter", () => {
    it("should return 'Hello' when passed 'hello'", () => {
        expect("hello".capitalizeFirstLetter()).toBe("Hello");
    });

    it("should return 'Hello' when passed 'HELLO'", () => {
        expect("HELLO".capitalizeFirstLetter()).toBe("Hello");
    });
});

//////////////////////////
// shuffle

describe("Array.prototype.shuffle", () => {
    it("should shuffle the array", () => {
        const arr = [1, 2, 3, 4, 5];
        const originalArr = [...arr];
        arr.shuffle();
        expect(arr).not.toEqual(originalArr);
    });

    it("should not change the length of the array", () => {
        const arr = [1, 2, 3, 4, 5];
        const originalLength = arr.length;
        arr.shuffle();
        expect(arr.length).toBe(originalLength);
    });
});
