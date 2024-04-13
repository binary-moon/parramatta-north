import type { PageLoad } from './$types';
import { formatDateDDMMMYYYY } from '$lib/utilities/calculations';

export const load = (async ({ fetch }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/news/`);
  const data = await response.json()

  const latestNews = data.map(news => {
    return {
      raw: news,
      title: news.title.rendered,
      image: undefined,
      description: news.acf.excerpt,
      href: `/latest-news/${news.id}`,
      date: formatDateDDMMMYYYY(news.date),
    }
  })

  return {
    latestNews,
  };
}) satisfies PageLoad;