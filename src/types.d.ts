export type Cookie = {
    path?: string;
    domain?: string;
    expires?: number | string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "strict" | "lax";
    httpOnly?: boolean;
};

export type MinimalTime = {
    h: number;
    m: number;
    s: number;
};
