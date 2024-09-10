import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/pages/${params.id}`);
  const data = await response.json();

  const pageData = {
    raw: data,
    title: data.title.rendered,
    detailImage: data.featured_media,
    htmlContent: data.content.rendered,
  };

  return {
    pageData,
    isFooterHidden: true,
    isWhiteLogo: true,
  };
}) satisfies PageLoad;
