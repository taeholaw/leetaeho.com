import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import optimizeImages from './integrations/optimize-images.mjs';

// 빌드가 끝나면 사이트 검색 색인(Pagefind)을 자동 생성 — 빌드 명령이 무엇이든 동작
const pagefind = () => ({
  name: 'pagefind',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const { createIndex, close } = await import('pagefind');
      const site = fileURLToPath(dir);
      const { index } = await createIndex();
      const { page_count } = await index.addDirectory({ path: site });
      await index.writeFiles({ outputPath: site + 'pagefind' });
      await close();
      logger.info(`검색 색인 생성: ${page_count}개 페이지`);
    },
  },
});

export default defineConfig({
  site: 'https://leetaeho.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') }), optimizeImages(), pagefind()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
