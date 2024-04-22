import type { PageLoad } from './$types';
import { formatDateDDMMMYYYY } from '$lib/utilities/calculations';

export const load = (async ({ fetch }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const toursEndpoint = `${apiUrl}/tour/`;
  const newsEndpoint = `${apiUrl}/news/`;
  const eventsEndpoint = `${apiUrl}/event/`;

  const [toursResponse, newsResponse, eventsResponse] = await Promise.all([
    fetch(toursEndpoint),
    fetch(newsEndpoint),
    fetch(eventsEndpoint),
  ]);

  const toursData = await toursResponse.json();
  const newsData = await newsResponse.json();
  const eventsData = await eventsResponse.json();

  const primaryTour = toursData[0];

  const events = eventsData.map(event => {
    return {
      raw: event,
      id: event.id,
      title: event.title.rendered,
      subtitle: event.acf.excerpt,
      tags: event.tags.map(tag => tag.name),
      image: event.acf.image,
      href: `/events/${event.id}`,
    }
  })

  const news = newsData.map(news => {
    return {
      raw: news,
      id: news.id,
      title: news.title.rendered,
      description: news.acf.excerpt,
      date: formatDateDDMMMYYYY(news.date),
      image: news.acf.image,
      href: `/news/${news.id}`,
    }
  });
  
  const tours = toursData.map(tour => {
    return {
      raw: tour,
      id: tour.id,
      title: tour.title.rendered,
      subtitle: tour.acf.excerpt,
      image: tour.acf.image,
      href: `/tours/${tour.id}`,
      tags: tour.tags.map(tag => tag.name),
    }
  });

  return {
    pageData: [
      {
        componentType: 'PrimaryPromo',
        raw: primaryTour,
        props: {
          title: primaryTour.title.rendered,
          subtitle: primaryTour.acf.excerpt,
          image: primaryTour.acf.image,
          href: `/tours/${primaryTour.id}`,
          tags: primaryTour.tags.map(tag => tag.name),
        },
      },
      {
        componentType: 'WhatsOnHome',
        raw: eventsData,
        props: {
          title: "What's on",
          moreLink: "/whats-on",
          items: events,
        },
      },
      {
        componentType: 'LatestNewsHome',
        raw: newsData,
        props: {
          title: "Latest News",
          moreLink: "/latest-news",
          items: news,
        },
      },
      {
        componentType: 'ToursHome',
        raw: eventsData,
        props: {
          title: "Tours",
          moreLink: "/tours",
          items: tours,
        },
      }
    ]
  };
}) satisfies PageLoad;