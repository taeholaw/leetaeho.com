import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { SITE } from '../site';

export async function GET(context: { site: URL }) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} — 글`,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date,
      link: `/writing/${p.id}/`,
      categories: [p.data.category],
    })),
    customData: '<language>ko</language>',
  });
}
