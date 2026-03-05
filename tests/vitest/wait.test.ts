import { describe, it, expect } from "vitest";
import { wait, waitFor, waitForEvent } from "../../src";
import { Millisecond, Second } from "@darco2903/secondthought";

const WAIT = 50; // 50ms
const TIMEOUT = 200; // 200ms

//////////////////////////
// wait

describe("wait", () => {
    it("should resolve after the specified time", async () => {
        const start = Date.now();
        const result = await wait(WAIT);
        expect(result).toBeUndefined();
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(WAIT);
        // console.log(`wait(${WAIT}) resolved after ${elapsed}ms`);
    });

    it("should resolve after the specified time with Time object", async () => {
        const start = Date.now();
        const result = await wait(new Millisecond(WAIT));
        expect(result).toBeUndefined();
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(WAIT);
        // console.log(`wait(${WAIT}) resolved after ${elapsed}ms`);
    });
});

//////////////////////////
// waitFor

describe("waitFor", () => {
    it("should resolve when the condition is true", async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, WAIT); // Change condition to true after WAIT

        const start = Date.now();
        await waitFor(() => condition, TIMEOUT);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(WAIT);
    });

    it("should throw an error if the timeout is reached", async () => {
        let condition = false;
        await expect(waitFor(() => condition, TIMEOUT)).rejects.toThrow("Timeout");
    });

    it("should resolve when the condition is true with Time objects", async () => {
        let condition = false;
        setTimeout(() => {
            condition = true;
        }, WAIT); // Change condition to true after WAIT

        const start = Date.now();
        await waitFor(() => condition, new Millisecond(TIMEOUT));
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(WAIT);
    });

    it("should throw an error if the timeout is reached with Time objects", async () => {
        let condition = false;
        await expect(waitFor(() => condition, new Millisecond(TIMEOUT))).rejects.toThrow("Timeout");
    });
});

//////////////////////////
// waitForEvent

describe("waitForEvent", () => {
    it("should resolve when the event is triggered", async () => {
        const elem = document.createElement("div");
        const eventPromise = waitForEvent(elem, "click");

        setTimeout(() => {
            elem.dispatchEvent(new MouseEvent("click"));
        }, WAIT);

        await eventPromise;
    });

    it("should resolve with the event object", async () => {
        const elem = document.createElement("div");
        const eventPromise = waitForEvent(elem, "click");

        setTimeout(() => {
            elem.dispatchEvent(new MouseEvent("click"));
        }, WAIT);

        const event = await eventPromise;
        expect(event.type).toBe("click");
    });
});

//////////////////////////
// waitForAnim

//////////////////////////
// waitForAnimIter

//////////////////////////
// waitForTransition
