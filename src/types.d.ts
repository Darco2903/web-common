export type Cookie = {
    path?: string;
    domain?: string;
    expires?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
    httpOnly?: boolean;
};

export type MinimalTime = {
    h: number;
    m: number;
    s: number;
};
