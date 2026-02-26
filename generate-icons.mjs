/**
 * generate-icons.mjs
 * Gera os ícones PWA necessários a partir do logo existente.
 * Cria: pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png
 * Uso: node generate-icons.mjs
 */

import { createCanvas } from 'canvas';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background — teal gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#0D9488'); // teal-600
    grad.addColorStop(1, '#059669'); // emerald-600
    ctx.fillStyle = grad;

    // Rounded square
    const radius = size * 0.18;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    // Psi symbol (Ψ)
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = `bold ${Math.round(size * 0.52)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ψ', size / 2, size * 0.46);

    // Orange accent dot below
    ctx.fillStyle = '#F59E0B'; // amber-400
    const dotR = size * 0.06;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.80, dotR, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toBuffer('image/png');
}

const sizes = [
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of sizes) {
    const buf = drawIcon(size);
    const dest = path.join(publicDir, name);
    writeFileSync(dest, buf);
    console.log(`✅ Criado: public/${name} (${size}x${size})`);
}

console.log('\n🎉 Ícones PWA gerados com sucesso!');
