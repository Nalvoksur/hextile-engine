import fs from "fs/promises";
import path from "path";
import { loadPNG } from "./loadPNG";
import { buildColorMap } from "./colorMap";
import { stringify } from "./stringify";

/**
 * Загружает PNG, конвертирует в формат HTL и сохраняет результат в файл.
 * @param inputPath Путь к исходному PNG файлу.
 * @param outputDir Опционально: папка для сохранения (по умолчанию — та же, что у исходника).
 */
export async function encodePNGtoHTL(inputPath: string, outputDir?: string): Promise<string> {
  try {
    // 1. Загружаем и парсим PNG
    const png = await loadPNG(inputPath);
    
    // 2. Генерируем карту цветов (уже с оптимизацией прозрачности)
    const map = buildColorMap(png);
    
    // 3. Превращаем карту в сжатую строку (без # и с короткими HEX)
    const content = stringify(map);

    // 4. Формируем путь к новому файлу
    const fileName = path.basename(inputPath, path.extname(inputPath)) + ".htl";
    const finalOutputPath = outputDir 
      ? path.join(outputDir, fileName) 
      : path.join(path.dirname(inputPath), fileName);

    // 5. Записываем данные в файл
    await fs.writeFile(finalOutputPath, content, "utf8");

    return finalOutputPath; // Возвращаем путь к созданному файлу
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`[Hextile Encoder] Error processing ${inputPath}: ${msg}`);
  }
}