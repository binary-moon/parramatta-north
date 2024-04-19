import type { PageLoad } from './$types';

import { formatDateDDMMMYYYY } from '$lib/utilities/calculations';

export const load = (async ({fetch, params}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/news/${params.id}`);
  const data = await response.json();

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: null,
    date: formatDateDDMMMYYYY(data.date),
    htmlContent: data.acf.description,
  }

  return { 
    pageData,
    isFooterHidden: true,
    isWhiteLogo: true,
  };
}) satisfies PageLoad;