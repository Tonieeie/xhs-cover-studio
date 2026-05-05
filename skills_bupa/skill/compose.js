/**
 * xhs-cover-frame-l · compose.js
 *
 * Pure Canvas renderer. Zero dependencies.
 *
 * Usage (browser):
 *   const blob = await composeCover({ sourceImage: file, logoUrl: 'assets/logo.png' });
 *   // blob is a JPEG Blob, 1242x1656
 *
 * Usage (Node, with `canvas` package):
 *   const { composeCoverNode } = require('./compose.js');
 *
 * AI agents: call this after you have a source image. Do not modify the
 * frame numbers — they ARE the brand identity.
 */

const SPEC = {
  W: 1242,
  H: 1656,
  BRAND: '#0E5BA8',
  LEFT_BAR_PCT: 9,     // % of width
  BOTTOM_BAR_PCT: 11,  // % of height
  LOGO_HEIGHT_PCT: 64, // % of bottom bar height
  LOGO_INSET_PCT: 5,   // % of bottom bar width (left inset)
  JPEG_QUALITY: 0.92,
};

/**
 * Compose a cover in the browser.
 * @param {Object} opts
 * @param {File|Blob|HTMLImageElement|string} opts.sourceImage - photo (File, Blob, <img>, or URL)
 * @param {string} opts.logoUrl - URL/path to brand logo
 * @returns {Promise<Blob>} JPEG blob
 */
async function composeCover({ sourceImage, logoUrl }) {
  const canvas = document.createElement('canvas');
  canvas.width = SPEC.W;
  canvas.height = SPEC.H;
  const ctx = canvas.getContext('2d');

  // 1. White background (in case logo or photo has transparency)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SPEC.W, SPEC.H);

  // 2. Compute regions
  const leftBarW = Math.round(SPEC.W * SPEC.LEFT_BAR_PCT / 100);
  const bottomBarH = Math.round(SPEC.H * SPEC.BOTTOM_BAR_PCT / 100);
  const photoX = leftBarW;
  const photoY = 0;
  const photoW = SPEC.W - leftBarW;
  const photoH = SPEC.H - bottomBarH;

  // 3. Draw photo (center-crop to cover)
  const photoImg = await loadImage(sourceImage);
  drawCover(ctx, photoImg, photoX, photoY, photoW, photoH);

  // 4. Draw left bar (brand color)
  ctx.fillStyle = SPEC.BRAND;
  ctx.fillRect(0, 0, leftBarW, SPEC.H);

  // 5. Draw bottom bar (white)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(leftBarW, SPEC.H - bottomBarH, SPEC.W - leftBarW, bottomBarH);

  // 6. Draw logo
  const logoImg = await loadImage(logoUrl);
  const logoH = Math.round(bottomBarH * SPEC.LOGO_HEIGHT_PCT / 100);
  const logoW = logoH; // square aspect
  const logoInset = Math.round((SPEC.W - leftBarW) * SPEC.LOGO_INSET_PCT / 100);
  const logoX = leftBarW + logoInset;
  const logoY = SPEC.H - bottomBarH + Math.round((bottomBarH - logoH) / 2);
  drawContain(ctx, logoImg, logoX, logoY, logoW, logoH);

  // 7. Export JPEG
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', SPEC.JPEG_QUALITY);
  });
}

/* -------- helpers -------- */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (src instanceof HTMLImageElement) {
      if (src.complete) return resolve(src);
      src.onload = () => resolve(src);
      src.onerror = reject;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob || src instanceof File) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}

/** Center-crop draw (object-fit: cover) */
function drawCover(ctx, img, dx, dy, dw, dh) {
  const ir = img.naturalWidth / img.naturalHeight;
  const tr = dw / dh;
  let sx, sy, sw, sh;
  if (ir > tr) {
    // image wider than target → crop horizontally
    sh = img.naturalHeight;
    sw = sh * tr;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    // image taller → crop vertically
    sw = img.naturalWidth;
    sh = sw / tr;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Contain draw (object-fit: contain), centered in dest box */
function drawContain(ctx, img, dx, dy, dw, dh) {
  const ir = img.naturalWidth / img.naturalHeight;
  const tr = dw / dh;
  let w, h;
  if (ir > tr) {
    w = dw; h = dw / ir;
  } else {
    h = dh; w = dh * ir;
  }
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
}

if (typeof window !== 'undefined') {
  window.composeCover = composeCover;
  window.XHS_COVER_SPEC = SPEC;
}
if (typeof module !== 'undefined') {
  module.exports = { composeCover, SPEC };
}
