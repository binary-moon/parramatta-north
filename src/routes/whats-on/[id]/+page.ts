import type { PageLoad } from "./$types";

import { formatStringToDateDDMMMYYYY } from "$lib/utilities/calculations";

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/event/${params.id}`);
  const data = await response.json();

  console.log('===============')
  console.log(data)
  console.log('===============')

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: data.acf.image,
    dateStart: data.acf.date_start ? formatStringToDateDDMMMYYYY(data.acf.date_start) : null,
    dateEnd: data.acf.date_end ? formatStringToDateDDMMMYYYY(data.acf.date_end) : null,
    duration: data.acf.duration,
    htmlContent: data.description,
    places: data.acf.places_included || [],
  };

  return {
    pageData,
    isFooterHidden: true,
    isWhiteLogo: true,
  };
}) satisfies PageLoad;
