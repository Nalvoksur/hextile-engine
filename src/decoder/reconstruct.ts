export function reconstructPixels(
    dataBody: string, 
    width: number, 
    height: number, 
    palette: string[]
): Uint8ClampedArray {
    const pixels = new Uint8ClampedArray(width * height * 4);
    const chunks = dataBody.split(',');
    let pixelPointer = 0;

    for (const chunk of chunks) {
        const [idx36, count36] = chunk.split(':');
        const paletteIndex = parseInt(idx36, 36);
        const count = parseInt(count36, 36);
        
        const hex = palette[paletteIndex];
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        for (let i = 0; i < count; i++) {
            const pos = pixelPointer * 4;
            pixels[pos] = r;
            pixels[pos + 1] = g;
            pixels[pos + 2] = b;
            pixels[pos + 3] = 255;
            pixelPointer++;
        }
    }
    return pixels;
}