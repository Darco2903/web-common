export type MinimalTime = {
    h: number;
    m: number;
    s: number;
};

const BYTES_UNITS = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

export function parseSize(size: number, options: { unit?: "B" | "o"; precision?: number; divider?: "SI" | "IEC" } = {}): string {
    const divider = options.divider === "IEC" ? 1024 : 1000;

    if (size < 0) {
        throw new Error("Size cannot be negative");
    }

    if (options.precision === undefined) {
        options.precision = 2; // Default precision
    } else if (options?.precision < 0) {
        throw new Error("Precision cannot be negative");
    }

    let u = 0;
    while (size >= divider && u < BYTES_UNITS.length - 1) {
        size /= divider;
        u++;
    }

    // if (size < 0.001 && u > 0) {
    //     // If the size is less than 0.001 and we are not at the smallest unit, we need to scale down
    //     size *= divider;
    //     u--;
    // }

    let parsed = size.toFixed(options.precision) + BYTES_UNITS[u];
    if (options.unit) {
        parsed += options.unit;
    }
    return parsed;
}

export function parseTime(time: number): MinimalTime {
    return {
        h: ~~(time / 3600),
        m: ~~((time % 3600) / 60),
        s: ~~(time % 60),
    };
}
