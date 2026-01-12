import { HextileParser } from '../decoder/parser';

export class HextileEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private assets: Map<string, ImageData> = new Map();
    
    private isRunning: boolean = false;
    private lastTime: number = 0;

    constructor(canvasId: string, width: number, height: number) {
        const el = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!el) throw new Error(`[Hextile] Canvas с id #${canvasId} не найден`);

        this.canvas = el;
        this.ctx = this.canvas.getContext('2d', { 
            alpha: true, 
            desynchronized: true 
        })!;

        this.updateResolution(width, height);
        
        console.log(`🕹️ Hextile Engine v1.1: Системы запущены [${width}x${height}]`);
    }

    public updateResolution(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.imageSmoothingEnabled = false;
    }

    public async loadAsset(name: string, url: string): Promise<boolean> { // Добавили boolean
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const buffer = new Uint8Array(await response.arrayBuffer());
            
            // Передаем буфер в твой парсер
            const decodedData = await HextileParser.decode(buffer);
            
            this.assets.set(name, decodedData);
            console.log(`📦 Asset cached: ${name} (${decodedData.width}x${decodedData.height})`);
            
            return true; // Возвращаем true, если всё прошло успешно
        } catch (e) {
            console.error(`❌ Failed to load asset "${name}":`, e);
            return false; // Возвращаем false, если случилась ошибка
        }
    }
    
    public draw(assetName: string, x: number = 0, y: number = 0) {
        const data = this.assets.get(assetName);
        if (data) {
            this.ctx.putImageData(data, x, y);
        } else {
            console.warn(`⚠️ Попытка нарисовать незагруженный ассет: ${assetName}`);
        }
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public start(callback: (dt: number) => void) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        
        const loop = (currentTime: number) => {
            if (!this.isRunning) return;

            const dt = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;

            callback(dt);
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    public stop() {
        this.isRunning = false;
        console.log("🛑 Движок остановлен");
    }
}