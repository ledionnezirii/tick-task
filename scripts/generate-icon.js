// One-off generator for the "Tick" app icon. Draws a curved squircle with a
// bold check mark, anti-aliased via analytic signed-distance coverage, and
// writes real PNGs (icon + Android adaptive foreground) using only Node's zlib.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 1024;

// Palette
const AMBER = [224, 162, 43];
const INK = [32, 29, 26];

// ---- PNG writer ---------------------------------------------------------
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function writePNG(file, width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // no filter
    rgba.copy(raw, y * stride + 1, y * width * 4, y * width * 4 + width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  fs.writeFileSync(
    file,
    Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
  );
}

// ---- geometry -----------------------------------------------------------
// Signed distance to a rounded rectangle centered at origin.
function sdRoundRect(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - halfW + r;
  const qy = Math.abs(py) - halfH + r;
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}
// Distance from point to a line segment.
function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return Math.hypot(pax - bax * h, pay - bay * h);
}
// Distance to the check mark (two segments, rounded by stroke width).
function sdCheck(px, py, scale) {
  const A = [-205 * scale, -10 * scale];
  const B = [-55 * scale, 120 * scale];
  const C = [195 * scale, -150 * scale];
  return Math.min(
    sdSegment(px, py, A[0], A[1], B[0], B[1]),
    sdSegment(px, py, B[0], B[1], C[0], C[1])
  );
}

function over(dst, i, rgb, a) {
  // alpha-composite rgb (opaque source with coverage a) over dst pixel
  const da = dst[i + 3] / 255;
  const outA = a + da * (1 - a);
  for (let k = 0; k < 3; k++) {
    const s = rgb[k] * a;
    const d = dst[i + k] * da * (1 - a);
    dst[i + k] = outA > 0 ? (s + d) / outA : 0;
  }
  dst[i + 3] = Math.round(outA * 255);
}

// ---- render -------------------------------------------------------------
function render({ withBackground, checkScale }) {
  const buf = Buffer.alloc(SIZE * SIZE * 4); // transparent
  const c = SIZE / 2;
  const aa = 1.6;
  const strokeHalf = 64 * checkScale;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const px = x + 0.5 - c;
      const py = y + 0.5 - c;

      if (withBackground) {
        const dBg = sdRoundRect(px, py, 470, 470, 215);
        const bgCov = Math.max(0, Math.min(1, 0.5 - dBg / aa));
        if (bgCov > 0) over(buf, i, AMBER, bgCov);
      }

      const dCheck = sdCheck(px, py, checkScale) - strokeHalf;
      const checkCov = Math.max(0, Math.min(1, 0.5 - dCheck / aa));
      if (checkCov > 0) over(buf, i, INK, checkCov);
    }
  }
  return buf;
}

const outDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(outDir, { recursive: true });

// Full app icon: amber squircle + ink check
writePNG(path.join(outDir, 'icon.png'), SIZE, SIZE, render({ withBackground: true, checkScale: 1 }));
// Android adaptive foreground: just the check, padded into the safe zone
writePNG(
  path.join(outDir, 'adaptive-icon.png'),
  SIZE,
  SIZE,
  render({ withBackground: false, checkScale: 0.62 })
);

console.log('Wrote assets/icon.png and assets/adaptive-icon.png');
