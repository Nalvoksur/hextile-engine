import { HextileEngine } from './core/HextileEngine';

const engine = new HextileEngine('game', 1280, 720);

async function initGame() {
    console.log("🚀 Запуск мониторинга...");

    // 1. Пытаемся загрузить ассет
    const success = await engine.loadAsset('map', '../docs/assets/test_map.htl.gz');

    if (success) {
        console.log("✅ Успешный вход в игровой цикл");

        engine.start((dt) => {
            // Замеряем время начала отрисовки
            const frameStart = performance.now();

            engine.clear();
            engine.draw('map', 0, 0);

            // Замеряем время конца отрисовки
            const frameEnd = performance.now();
            const renderMs = (frameEnd - frameStart).toFixed(3);

            // Выводим инфо раз в 2 секунды (примерно)
            if (Math.random() < 0.01) {
                const fps = Math.round(1 / dt);
                
                // Проверка памяти (только для Chrome)
                const memInfo = (performance as any).memory 
                    ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB` 
                    : "N/A";

                console.log(`📊 [STATS] FPS: ${fps} | Render: ${renderMs}ms | RAM: ${memInfo}`);
            }
        });
    } else {
        console.error("🛑 Загрузка прервана. Проверь файл в папке public/assets/");
    }
}

initGame();