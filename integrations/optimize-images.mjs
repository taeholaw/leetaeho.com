// 사진 자동 최적화 — 빌드가 끝난 뒤 실행됩니다.
// 1) /images/uploads 의 사진을 최대 가로 2000px로 줄이고 압축합니다 (원본 파일 이름 유지).
// 2) 800·1400·2000px WebP 사본을 만듭니다.
// 3) 모든 페이지의 <img>를 <picture>로 바꿔, 화면 크기에 맞는 WebP를 내려받게 합니다.
// 저장소의 원본 사진은 건드리지 않습니다.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const UPLOAD_URL = '/images/uploads/';
const WIDTHS = [800, 1400, 2000];
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir, ext) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, ext)));
    else if (!ext || e.name.endsWith(ext)) out.push(p);
  }
  return out;
}

export default function optimizeImages() {
  return {
    name: 'optimize-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const uploadDir = join(root, 'images', 'uploads');
        const info = new Map(); // 파일명 → { width, height, variants }
        let before = 0, after = 0;

        let files = [];
        try { files = await readdir(uploadDir); } catch { return; }

        for (const name of files) {
          const ext = extname(name).toLowerCase();
          if (!RASTER.has(ext)) continue;
          const src = join(uploadDir, name);
          const input = await readFile(src);
          before += input.length;
          try {
            const img = sharp(input, { failOn: 'none' }).rotate(); // 휴대폰 사진 회전값 반영
            const meta = await img.metadata();
            const w0 = meta.autoOrient?.width ?? meta.width;
            const h0 = meta.autoOrient?.height ?? meta.height;
            const maxW = Math.min(w0, 2000);

            // 원본 이름 그대로 압축본 저장 (대표 사진·공유 미리보기용)
            let fallback = img.clone().resize({ width: maxW, withoutEnlargement: true });
            fallback = ext === '.png' ? fallback.png({ compressionLevel: 9, palette: true })
              : ext === '.webp' ? fallback.webp({ quality: 80 })
              : fallback.jpeg({ quality: 80, mozjpeg: true });
            const fb = await fallback.toBuffer();
            await writeFile(src, fb.length < input.length ? fb : input);
            after += Math.min(fb.length, input.length);

            // WebP 사본
            const base = name.slice(0, -ext.length);
            const variants = [];
            for (const w of WIDTHS.filter((w) => w < maxW).concat(maxW)) {
              const out = `${base}-${w}.webp`;
              const buf = await img.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
              await writeFile(join(uploadDir, out), buf);
              variants.push(`${UPLOAD_URL}${encodeURIComponent(out)} ${w}w`);
            }
            info.set(name, { width: maxW, height: Math.round((h0 * maxW) / w0), variants });
          } catch (err) {
            logger.warn(`사진 처리 실패(원본 유지): ${name} — ${err.message}`);
            after += input.length;
          }
        }

        // HTML의 <img>를 <picture>로 교체
        const imgRe = /<img\b([^>]*?)\bsrc="(\/images\/uploads\/[^"]+)"([^>]*?)\/?>/g;
        for (const page of await walk(root, '.html')) {
          let html = await readFile(page, 'utf8');
          if (!html.includes(UPLOAD_URL)) continue;
          const next = html.replace(imgRe, (tag, pre, url, post) => {
            const name = decodeURIComponent(url.slice(UPLOAD_URL.length));
            const m = info.get(name);
            if (!m) return tag;
            const attrs = `${pre}${post}`.replace(/\s+(width|height|loading|decoding)="[^"]*"/g, '');
            const eager = /loading="eager"/.test(tag);
            return `<picture><source type="image/webp" srcset="${m.variants.join(', ')}" sizes="(max-width: 720px) 100vw, 680px">` +
              `<img${attrs} src="${url}" width="${m.width}" height="${m.height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></picture>`;
          });
          if (next !== html) await writeFile(page, next);
        }

        const mb = (n) => (n / 1048576).toFixed(1);
        logger.info(`사진 ${info.size}장 최적화: ${mb(before)}MB → ${mb(after)}MB (+ WebP 사본)`);
      },
    },
  };
}
