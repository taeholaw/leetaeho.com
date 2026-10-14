import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './site';

// 글 (Writing)
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(CATEGORIES),
    cover: z.string().optional(), // /images/... 경로
    draft: z.boolean().default(false),
  }),
});

// 작업 (Work) — 음악·사진·영상
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    kind: z.enum(['음악', '사진', '영상']),
    date: z.coerce.date(),
    description: z.string().optional(),
    cover: z.string().optional(),
    link: z.string().optional(), // SoundCloud·YouTube 등 외부 링크
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, work };
