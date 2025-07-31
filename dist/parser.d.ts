export type MinimalTime = {
    h: number;
    m: number;
    s: number;
};
export declare function parseSize(size: number, unit?: "B" | "o"): string;
export declare function parseTime(time: number): MinimalTime;
