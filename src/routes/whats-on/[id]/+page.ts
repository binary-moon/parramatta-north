import type { PageLoad } from './$types';

import { formatStringToDateDDMMMYYYY } from '$lib/utilities/calculations';

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/event/${params.id}`);
  const data = await response.json();

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: data.acf.image,
    dateStart: formatStringToDateDDMMMYYYY(data.acf.date_start),
    dateEnd: formatStringToDateDDMMMYYYY(data.acf.date_end),
    htmlContent: data.description,
    places: data.acf.places_included,
  }

  return {
    pageData,
    isFooterHidden: true,
    isWhiteLogo: true,
  }
}) satisfies PageLoad;