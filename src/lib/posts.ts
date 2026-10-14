import { getCollection } from 'astro:content';

const isProd = import.meta.env.PROD;

export async function getPosts() {
  const posts = await getCollection('writing', (p) => !(isProd && p.data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getWorks() {
  const works = await getCollection('work', (p) => !(isProd && p.data.draft));
  return works.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const fmtDate = (d: Date) =>
  `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
