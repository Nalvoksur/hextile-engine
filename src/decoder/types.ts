import pako from 'pako';

export function decompressHextile(buffer: Uint8Array): string {
    return pako.ungzip(buffer, { to: 'string' });
}

export interface HextileHeader {
    width: number;      // Ширина изображения в пикселях
    height: number;     // Высота изображения в пикселях
    palette: string[];  // Массив HEX-цветов (без символа #)
    dataBody: string;   // Строка с RLE-данными (после DATA|)
}

export interface DecodeOptions {
    asImageData?: boolean; // Нужно ли возвращать объект ImageData
    renderTo?: HTMLCanvasElement; // Ссылка на канвас для прямой отрисовки
}