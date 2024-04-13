import type { PageLoad } from './$types';

export const load = (async ({fetch}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/faq/`);
  const data = await response.json();

  const faqs = data.map(faq => {
    return {
      raw: faq,
      question: faq.acf.question,
      answer: faq.acf.answer,
    }
  });

  return {
    faqs,
  }
}) satisfies PageLoad;
