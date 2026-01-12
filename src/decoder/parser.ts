import pako from 'pako';

export interface HextileHeader {
    width: number;
    height: number;
    palette: string[];
    dataBody: string;
}

/**
 * Парсит текстовую структуру после декомпрессии
 */
export function parseHextileRaw(rawText: string): HextileHeader {
    // Делим на заголовок и данные по маркеру DATA|
    const [headerPart, dataBody] = rawText.split('DATA|');
    const lines = headerPart.trim().split('\n');

    const infoLine = lines.find(l => l.startsWith('INFO|'));
    const paletteLine = lines.find(l => l.startsWith('PALETTE|'));

    if (!infoLine || !paletteLine) {
        throw new Error("Неверный формат Hextile: отсутствуют INFO или PALETTE");
    }

    const info = infoLine.split('|')[1].split('x');
    
    return {
        width: parseInt(info[0]),
        height: parseInt(info[1]),
        palette: paletteLine.split('|')[1].split(','),
        dataBody: dataBody || ""
    };
}

export class HextileParser {
    /**
     * Главный метод: Бинарные данные -> ImageData
     */
    public static async decode(buffer: Uint8Array): Promise<ImageData> {
        let rawText: string;

        // 1. Умная декомпрессия (решает проблему incorrect header check)
        try {
            // Пробуем Gzip (стандарт для .gz файлов)
            rawText = pako.ungzip(buffer, { to: 'string' });
        } catch (e) {
            try {
                // Если не вышло, пробуем Zlib (Deflate)
                rawText = pako.inflate(buffer, { to: 'string' });
            } catch (e2) {
                // Если и это не вышло, возможно файл вообще не сжат
                console.warn("Файл не сжат или имеет неизвестный формат. Пробуем прочитать как текст.");
                rawText = new TextDecoder().decode(buffer);
            }
        }

        // 2. Парсим структуру заголовка
        const header = parseHextileRaw(rawText);

        // 3. Создаем ImageData для Canvas
        const imgData = new ImageData(header.width, header.height);
        const pixels = imgData.data;

        // 4. Восстановление пикселей из Delta-кодирования
        const layers = header.dataBody.split('|').filter(l => l.length > 0);
        
        for (const layer of layers) {
            const [pIdx36, indicesRaw] = layer.split(':');
            const colorIdx = parseInt(pIdx36, 36);
            const hex = header.palette[colorIdx];
            
            // Быстрая конвертация HEX в RGB
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            
            let currentIdx = 0;
            const diffs = indicesRaw.split(',');
            
            for (const d of diffs) {
                // Восстанавливаем абсолютный индекс пикселя из дельты
                currentIdx += parseInt(d, 36);
                const p = currentIdx * 4;
                
                pixels[p]     = r;
                pixels[p + 1] = g;
                pixels[p + 2] = b;
                pixels[p + 3] = 255; // Alpha
            }
        }

        return imgData;
    }
}