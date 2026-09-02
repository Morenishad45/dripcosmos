import * as THREE from 'three';

/**
 * Generates the outer lid texture with authentic Drip Cosmos packaging artwork:
 * - Top Left: FIRST DROP / ANIMAL KINGDOM with 4-point star
 * - Center: Geometric DC Planet Logo with dripping accent
 * - Brand: DRIP COSMOS / MANIFESTED NOT MANUFACTURED
 * - Quote: BUILT ON VISION, FUELED BY PURPOSE, MADE FOR THE FEW. NOT FOR THE MANY.
 * - Top Right: LIMITED EDITION / 001 / 500 with globe emblem
 */
export function createBoxLidOuterTexture(editionNumber: string = "001 / 500"): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Background: off-white premium cardboard texture
  ctx.fillStyle = '#EBE8DF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper speckle noise
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Draw 4-point star helper
  const drawStar = (cx: number, cy: number, size: number, color: string = '#141414') => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // 1. Top-Left Section: FIRST DROP / ANIMAL KINGDOM
  ctx.fillStyle = '#141414';
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('FIRST DROP', 180, 240);
  ctx.font = '700 38px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('ANIMAL KINGDOM', 180, 290);
  drawStar(210, 360, 28);

  // 2. Top-Right Section: LIMITED EDITION / 001 / 500 + Globe
  ctx.textAlign = 'right';
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('LIMITED EDITION', canvas.width - 180, 240);
  ctx.font = '700 40px "Space Grotesk", monospace';
  ctx.letterSpacing = '8px';
  ctx.fillText(editionNumber, canvas.width - 180, 290);

  // Globe Wireframe Icon
  const globeX = canvas.width - 240;
  const globeY = 360;
  const radius = 35;
  ctx.save();
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(globeX, globeY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(globeX, globeY, radius, radius * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(globeX, globeY, radius * 0.4, radius, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(globeX - radius, globeY);
  ctx.lineTo(globeX + radius, globeY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(globeX, globeY - radius);
  ctx.lineTo(globeX, globeY + radius);
  ctx.stroke();
  ctx.restore();

  // 3. Center DC Logo Drawing
  ctx.textAlign = 'center';
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 120;

  // Render authentic geometric DC silhouette
  ctx.save();
  ctx.fillStyle = '#141414';
  ctx.strokeStyle = '#141414';

  // Letter 'D' stylized geometric polygon
  ctx.beginPath();
  ctx.moveTo(cx - 300, cy - 260); // top apex
  ctx.lineTo(cx - 40, cy - 80);
  ctx.lineTo(cx - 40, cy + 220);
  ctx.lineTo(cx - 190, cy + 330);
  ctx.lineTo(cx - 300, cy + 200);
  ctx.closePath();
  ctx.fill();

  // Cutout inside 'D'
  ctx.fillStyle = '#EBE8DF';
  ctx.beginPath();
  ctx.moveTo(cx - 240, cy - 140);
  ctx.lineTo(cx - 100, cy - 40);
  ctx.lineTo(cx - 100, cy + 170);
  ctx.lineTo(cx - 200, cy + 240);
  ctx.lineTo(cx - 240, cy + 180);
  ctx.closePath();
  ctx.fill();

  // Letter 'C' stylized geometric polygon with drip
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.moveTo(cx + 60, cy - 220);
  ctx.lineTo(cx + 250, cy - 90);
  ctx.lineTo(cx + 180, cy - 20);
  ctx.lineTo(cx + 120, cy - 60);
  ctx.lineTo(cx + 40, cy);
  ctx.lineTo(cx + 40, cy + 130);
  ctx.lineTo(cx + 120, cy + 190);
  ctx.lineTo(cx + 250, cy + 130);
  ctx.lineTo(cx + 250, cy + 260);
  ctx.lineTo(cx + 70, cy + 300);
  ctx.lineTo(cx - 20, cy + 200);
  ctx.lineTo(cx - 20, cy - 130);
  ctx.closePath();
  ctx.fill();

  // Dripping liquid under C
  ctx.beginPath();
  ctx.arc(cx + 10, cy + 280, 16, 0, Math.PI);
  ctx.arc(cx + 90, cy + 340, 20, 0, Math.PI * 2);
  ctx.arc(cx + 160, cy + 310, 15, 0, Math.PI * 2);
  ctx.fill();

  // Orbiting ring through DC
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#141414';
  ctx.beginPath();
  ctx.ellipse(cx - 10, cy + 20, 220, 90, -Math.PI / 10, 0, Math.PI * 2);
  ctx.stroke();

  // Planetary stars on D & C body
  const dots = [
    { x: cx - 260, y: cy - 200 },
    { x: cx - 180, y: cy - 20 },
    { x: cx - 120, y: cy + 120 },
    { x: cx - 260, y: cy + 140 },
    { x: cx - 210, y: cy + 280 },
    { x: cx + 180, y: cy - 140 },
    { x: cx + 220, y: cy + 210 },
  ];
  ctx.fillStyle = '#EBE8DF';
  dots.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 4. Main Typography: DRIP COSMOS
  ctx.fillStyle = '#141414';
  ctx.font = '800 84px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '18px';
  ctx.fillText('DRIP COSMOS', cx, cy + 500);

  // Sub-brand: MANIFESTED NOT MANUFACTURED
  ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '12px';
  ctx.fillText('MANIFESTED NOT MANUFACTURED', cx, cy + 570);

  // 5. Divider with center Star
  const lineY = cy + 690;
  ctx.strokeStyle = 'rgba(20, 20, 20, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(250, lineY);
  ctx.lineTo(cx - 60, lineY);
  ctx.stroke();

  drawStar(cx, lineY, 22);

  ctx.beginPath();
  ctx.moveTo(cx + 60, lineY);
  ctx.lineTo(canvas.width - 250, lineY);
  ctx.stroke();

  // 6. Manifesto sentence
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('BUILT ON VISION, FUELED BY PURPOSE,', cx, lineY + 70);
  ctx.fillText('MADE FOR THE FEW. NOT FOR THE MANY.', cx, lineY + 125);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates the inner lid texture with message:
 * - Star
 * - "YOU DON'T FOLLOW TRENDS. YOU SET YOUR ORBIT."
 * - "THANK YOU FOR BEING A PART OF OUR UNIVERSE."
 * - Center DC Logo
 * - "#DRIPCOSMOS"
 */
export function createBoxLidInnerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Background: off-white matte inner surface
  ctx.fillStyle = '#EDEAE2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle paper grain
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  for (let i = 0; i < 40000; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
  }

  const cx = canvas.width / 2;

  // Star at top
  const drawStar = (cy: number, size: number) => {
    ctx.save();
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawStar(380, 32);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#141414';

  // Primary quote
  ctx.font = '700 48px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText("YOU DON'T FOLLOW TRENDS.", cx, 540);
  ctx.fillText("YOU SET YOUR ORBIT.", cx, 615);

  // Secondary quote
  ctx.font = '500 36px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#333333';
  ctx.fillText("THANK YOU FOR BEING", cx, 730);
  ctx.fillText("A PART OF OUR UNIVERSE.", cx, 790);

  // Center DC Emblem
  const emblemY = 1080;
  ctx.fillStyle = '#141414';
  ctx.font = '800 160px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText("DC", cx, emblemY);

  // Hashtag
  ctx.font = '700 42px "Space Grotesk", monospace';
  ctx.letterSpacing = '8px';
  ctx.fillText("#DRIPCOSMOS", cx, emblemY + 160);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates the packaging tissue paper texture:
 * - Translucent white paper appearance
 * - Repeating grid of monochrome DC planet emblems
 * - Center "Limited EDITION" round sticker seal
 */
export function createTissuePatternTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // Translucent off-white crinkled tissue base
  ctx.fillStyle = '#F4F2EC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paper creases & crinkles
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let px = Math.random() * canvas.width;
    let py = Math.random() * canvas.height;
    ctx.moveTo(px, py);
    for (let j = 0; j < 5; j++) {
      px += (Math.random() - 0.5) * 300;
      py += (Math.random() - 0.5) * 300;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Draw repeating DC icons
  const rows = 7;
  const cols = 7;
  const cellW = canvas.width / cols;
  const cellH = canvas.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW + cellW / 2 + ((r % 2) * cellW * 0.35);
      const y = r * cellH + cellH / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.15 + (Math.sin(r * 2 + c) * 0.1));
      ctx.fillStyle = 'rgba(25, 25, 25, 0.65)';
      ctx.font = '800 68px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DC', 0, 0);

      // Orbit ring around DC
      ctx.strokeStyle = 'rgba(25, 25, 25, 0.55)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 5, 55, 22, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Center "Limited EDITION" round paper sticker seal
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const stickerRadius = 180;

  ctx.save();
  // Sticker drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;

  // Sticker circle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, stickerRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Sticker text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111111';
  ctx.font = 'italic 700 68px "Italiana", serif';
  ctx.fillText('Limited', cx, cy - 10);

  // Horizontal line through EDITION
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy + 25);
  ctx.lineTo(cx + 110, cy + 25);
  ctx.stroke();

  ctx.font = '700 28px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('EDITION', cx + 5, cy + 55);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
