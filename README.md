# 🚀 Hextile Engine

A high-performance custom image compression format designed for large-scale textures (4K+) in game engines. Hextile outperforms standard PNG by utilizing **Base36 RLE-Delta encoding** combined with Gzip.

## 📊 Benchmark: PNG vs Hextile
Testing on a 4K Satellite Terrain Texture (3840x2160):
- **Original PNG:** 33.2 MB
- **Gzipped Hextile:** 19.4 MB
- **Compression Ratio:** **~1.7x smaller than PNG**

![4K Benchmark Result](./docs/assets/benchmark_4k.png)

## ✨ Features
- **RLE-Delta Encoding:** Specialized for patterns and large areas of similar colors.
- **Base36 Serialization:** Ultra-short character representation for coordinates and indices.
- **Engine-Ready:** Designed to be parsed directly into a Collision Map or Logic Grid.
- **Quantization:** Built-in color optimization to reduce noise.
- **Progressive Rendering:** Integrated visualizer to see image reconstruction layer-by-layer.
- **Real-time Studio:** Interactive GUI with live quantization (1-64) and size estimation.

---

## 🇷🇺 О проекте (Russian)
**Hextile Engine** — это кастомный формат сжатия изображений, оптимизированный для 4K текстур ландшафтов. 

### Почему это круто?
Стандартный PNG плохо справляется с избыточностью в огромных разрешениях. Hextile использует разницу между индексами пикселей (дельты) и повторители (RLE), упаковывая всё в Base36. Результат — текстура земли весит **на 40% меньше**, чем PNG, при сохранении высокой детализации.

---

## 🛠 Project Structure
- `/src/encoder`: Logic for converting PNG/Raw data to `.htl`.
- `/src/decoder`: High-speed Reader for web and engine integration.
- `/src/demo`: Web-based converter and visualizer.

## 🚀 Quick Start
1. Clone the repo: `git clone ...`
2. Install dependencies: `npm install`
3. Run demo: Open `src/demo/test-encoder.html` in your browser.

## 🛠 Technical Specification (v1.1)

Hextile is a text-based protocol designed for maximum Gzip entropy efficiency. It organizes image data into color-specific layers.

### Format Structure
The `.htl` stream (before Gzipping) consists of three segments:
`INFO|PALETTE|DATA`

1. **INFO**: `{width}x{height}` (e.g., `1920x1080`).
2. **PALETTE**: Comma-separated HEX colors (e.g., `FFFFFF,000000,FF0000`).
3. **DATA**: Encoded as `{ColorIdx}:{DeltaStream}|`
   - **ColorIdx**: Base36 index pointing to the Palette.
   - **DeltaStream**: The first value is the absolute pixel index. Every subsequent value is a **relative distance (delta)** from the previous pixel, all in **Base36**.

Example: `1:50,a,2|` means color at Palette[1] occupies pixels 80, 90 (80+10), and 92 (90+2) — *assuming 'a' is 10 in Base36*.

## 📜 License
MIT