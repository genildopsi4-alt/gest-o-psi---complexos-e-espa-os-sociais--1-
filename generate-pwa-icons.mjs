/**
 * generate-pwa-icons.mjs
 * Gera os ícones PWA usando sharp a partir do logo existente.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SVG base para o ícone (fundo teal + símbolo Ψ + ponto laranja)
const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D9488"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
    <clipPath id="rounded">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.18}" ry="${size * 0.18}"/>
    </clipPath>
  </defs>
  <!-- Background -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.18}" ry="${size * 0.18}" fill="url(#bg)"/>
  <!-- Psi Symbol -->
  <text
    x="${size / 2}"
    y="${size * 0.52}"
    font-family="Georgia, serif"
    font-size="${size * 0.50}"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
    opacity="0.95"
  >Ψ</text>
  <!-- Orange accent dot -->
  <circle cx="${size / 2}" cy="${size * 0.80}" r="${size * 0.055}" fill="#F59E0B"/>
</svg>
`;

const publicDir = path.join(__dirname, 'public');

const icons = [
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
];

(async () => {
    for (const { name, size } of icons) {
        const svg = Buffer.from(svgIcon(size));
        const dest = path.join(publicDir, name);
        await sharp(svg).png().toFile(dest);
        console.log(`✅ ${name} (${size}x${size})`);
    }
    console.log('\n🎉 Ícones PWA gerados em public/');
})();
