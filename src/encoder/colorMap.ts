import { PNG } from "pngjs";
import { ColorMap, EncodeOptions, RGBA } from "./types";
import { toHex } from "./hex";

export function buildColorMap(
    png: PNG,
    options: EncodeOptions = {}
): ColorMap {
    const map: ColorMap = new Map();
    const { data } = png;

    let pixelIndex = 1;

    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];

        if (a === 0) {
            pixelIndex++;
            continue;
        }

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const finalAlpha = options.includeAlpha === false ? 255 : a;

        const hex = toHex(r, g, b, finalAlpha);

        let indices = map.get(hex);
        if (indices === undefined) {
            indices = [];
            map.set(hex, indices);
        }

        indices.push(pixelIndex++);
    }

    return map;
}