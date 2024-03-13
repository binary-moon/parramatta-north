import type { PageLoad } from './$types';
import data from '../data.json'

export const load = (async ({ params }) => {
  console.log(params.slug)
  console.log(data)
  const pageData = data.find((place) => place.slug === params.slug);
  return { 
      pageData,
      isFooterHidden: true,
      isWhiteLogo: true,
  };
}) satisfies PageLoad;