import fs from "fs";
import { PNG } from "pngjs";

export function loadPNG(path: string): Promise<PNG> {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(path);
        
        const png = new PNG();

        stream
            .pipe(png)
            .on("parsed", () => {
                resolve(png);
            })
            .on("error", (err) => {
                reject(new Error(`Ошибка при чтении PNG [${path}]: ${err.message}`));
            });
    });
}