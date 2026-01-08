export function toHex(r: number, g: number, b: number, a: number): string {
    const q = (c: number) => Math.round(c / 8) * 8;

    const hex = (c: number) => {
        const h = q(c).toString(16);
        return h.length === 1 ? "0" + h : h;
    };

    let rH = hex(r);
    let gH = hex(g);
    let bH = hex(b);
    
    if (rH[0] === rH[1] && gH[0] === gH[1] && bH[0] === bH[1]) {
        return (rH[0] + gH[0] + bH[0]).toUpperCase();
    }

    return (rH + gH + bH).toUpperCase();
}