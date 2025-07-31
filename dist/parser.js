const BYTES_UNITS = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
export function parseSize(size, unit) {
    let u = 0;
    while (size >= 1024 && u < BYTES_UNITS.length - 1) {
        size /= 1024;
        u++;
    }
    let parsed = size.toFixed(2);
    if (unit) {
        parsed += BYTES_UNITS[u] + unit;
    }
    return parsed;
}
export function parseTime(time) {
    return {
        h: ~~(time / 3600),
        m: ~~((time % 3600) / 60),
        s: ~~(time % 60),
    };
}
