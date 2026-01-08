export type RGBA = [
    r: number,
    g: number,
    b: number,
    a: number
];

export type ColorMap = Map<string, number[]>;

export interface EncodeOptions {
    includeAlpha?: boolean;
}