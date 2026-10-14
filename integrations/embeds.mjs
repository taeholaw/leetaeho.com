// 본문에 SoundCloud·YouTube 주소만 한 줄로 붙여 넣으면 플레이어로 바꿔 줍니다.
// (편집 화면이 <iframe> 코드를 지우거나 깨뜨리는 문제를 피하기 위한 방식)
export function embedHtml(raw) {
  let url;
  try { url = new URL(raw.trim()); } catch { return null; }
  const host = url.hostname.replace(/^www\.|^m\./, '');

  if (host === 'soundcloud.com' || host === 'on.soundcloud.com') {
    const clean = `${url.origin}${url.pathname}`; // ?si= 같은 추적 값 제거
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(clean)}` +
      '&color=%2323439e&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false';
    return `<div class="embed embed-audio"><iframe src="${src}" width="100%" height="166" loading="lazy" allow="autoplay; encrypted-media" title="SoundCloud 플레이어" frameborder="0"></iframe></div>`;
  }

  let yt = null;
  if (host === 'youtu.be') yt = url.pathname.slice(1);
  else if (host === 'youtube.com' || host === 'music.youtube.com') {
    yt = url.searchParams.get('v') || (url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/) || [])[1];
  }
  if (yt && /^[\w-]{6,}$/.test(yt)) {
    return `<div class="embed embed-video"><iframe src="https://www.youtube-nocookie.com/embed/${yt}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen title="YouTube 동영상" frameborder="0"></iframe></div>`;
  }
  return null;
}

// 빌드가 끝난 뒤, 주소 한 줄만 있는 문단(<p>주소</p> 또는 <p><a>주소</a></p>)을 플레이어로 교체
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&#x26;/g, '&').replace(/&quot;/g, '"');

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function embeds() {
  return {
    name: 'embeds',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const re = /<p>\s*(?:<a [^>]*href="([^"]+)"[^>]*>[^<]*<\/a>|(https?:\/\/[^\s<]+))\s*<\/p>/g;
        let n = 0;
        for (const f of await htmlFiles(fileURLToPath(dir))) {
          const html = await readFile(f, 'utf8');
          const next = html.replace(re, (m, href, bare) => {
            const out = embedHtml(unescape(href || bare));
            if (out) n++;
            return out || m;
          });
          if (next !== html) await writeFile(f, next);
        }
        if (n) logger.info(`플레이어 ${n}개 삽입`);
      },
    },
  };
}
