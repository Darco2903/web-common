// @vitest-environment node
import { describe, it, expect } from "vitest";
import { THEMES, loadSetting, saveSetting } from "../../src/index.js";

describe("settings outside a browser", () => {
    it("should load nothing and save nothing without throwing", () => {
        expect(typeof window).toBe("undefined");
        expect(() => saveSetting("theme", "dark")).not.toThrow();
        expect(loadSetting("theme", THEMES)).toBeUndefined();
    });
});
