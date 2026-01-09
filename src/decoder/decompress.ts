import pako from 'pako';

export function decompressHextile(buffer: Uint8Array): string {
    try {
        return pako.ungzip(buffer, { to: 'string' });
    } catch (error) {
        console.error("Ошибка при распаковке Gzip:", error);
        throw new Error("Failed to decompress Hextile data.");
    }
}