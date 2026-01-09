export interface HextileHeader {
    width: number;
    height: number;
    palette: string[];
    dataBody: string;
}

export function parseHextileRaw(rawText: string): HextileHeader {
    const [header, dataBody] = rawText.split('\nDATA|');
    const lines = header.split('\n');

    const info = lines.find(l => l.startsWith('INFO|'))?.split('|')[1].split('x');
    const paletteLine = lines.find(l => l.startsWith('PALETTE|'))?.split('|')[1];

    if (!info || !paletteLine) throw new Error("Invalid Hextile format");

    return {
        width: parseInt(info[0]),
        height: parseInt(info[1]),
        palette: paletteLine.split(','),
        dataBody: dataBody
    };
}