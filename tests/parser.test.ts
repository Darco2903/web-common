import { describe, it, expect } from "vitest";
import { parseSize, parseTime } from "../src";

//////////////////////////
// parseSize

describe("parseSize", () => {
    it("should parse 0 bytes to '0.00'", () => {
        expect(parseSize(0)).toBe("0.00");
    });

    it("should parse 0 bytes to '0.00'", () => {
        expect(parseSize(0, { precision: 0 })).toBe("0");
    });

    it("should parse with negative size to throw an error", () => {
        expect(() => parseSize(-54412)).toThrowError("Size cannot be negative");
    });

    it("should parse 1024 bytes to '1.02k'", () => {
        expect(parseSize(1024)).toBe("1.02k");
    });

    it("should parse 1024 bytes to '1.02k'", () => {
        expect(parseSize(1024, { divider: "IEC" })).toBe("1.00k");
    });

    it("should parse 123456789 bytes to '123.46M'", () => {
        expect(parseSize(123456789, { precision: 0 })).toBe("123M");
    });

    it("should parse 123456789 bytes to '123.46M'", () => {
        expect(parseSize(123456789, { precision: 2 })).toBe("123.46M");
    });

    it("should parse 123456789 bytes to '123.46Mo'", () => {
        expect(parseSize(123456789, { precision: 2, unit: "o" })).toBe("123.46Mo");
    });

    it("should parse 123456789 bytes to '123.46MB'", () => {
        expect(parseSize(123456789, { precision: 2, unit: "B" })).toBe("123.46MB");
    });

    it("should parse with negative precision to throw an error", () => {
        expect(() => parseSize(123456789, { precision: -1, unit: "B", divider: "IEC" })).toThrowError("Precision cannot be negative");
    });
});

//////////////////////////
// parseTime

describe("parseTime", () => {
    it("should parse 0 seconds to '0h 0m 0s'", () => {
        expect(parseTime(0)).toEqual({ h: 0, m: 0, s: 0 });
    });

    it("should parse 60 seconds to '0h 1m 0s'", () => {
        expect(parseTime(60)).toEqual({ h: 0, m: 1, s: 0 });
    });

    it("should parse 3600 seconds to '1h 0m 0s'", () => {
        expect(parseTime(3600)).toEqual({ h: 1, m: 0, s: 0 });
    });

    it("should parse 3661 seconds to '1h 1m 1s'", () => {
        expect(parseTime(3661)).toEqual({ h: 1, m: 1, s: 1 });
    });
});
