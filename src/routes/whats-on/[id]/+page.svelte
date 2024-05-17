<script lang="ts">
  import { onMount } from 'svelte';

  import Prose from '$lib/Prose.svelte';
  import Button from '$lib/Button.svelte';
  import PlacesCard from '$lib/PlacesCard.svelte'; 
  import WhatsOnMap from '$lib/WhatsOnMap.svelte';
  import Image from '$lib/Image.svelte';

  import { isPageScrolled } from '$lib/store';

  import { calculateDistance } from '$lib/utilities/calculations';
  import { fetchImage } from '$lib/utilities/fetchMedia.js';
  import { updateVideoTags } from '$lib/utilities/htmlParser.js';

  let scrollDiv: HTMLDivElement;

  export let data;
  
  const { pageData } = data
  const { detailImage, title, dateStart, dateEnd, htmlContent, places: placeIds } = pageData;
  const detailImagePlaceholder = "https://placehold.co/1284x1080/black/333"
  const apiUrl = import.meta.env.VITE_API_URL;

  let places = [];
  let arePlacesFetched = false;
  let watchId: number | null;
  let isMapView: boolean = false;
  let parsedHTML: string;

  const fetchPlaces = async () => {
    try {
      const promises = placeIds.map(id => fetch(`${apiUrl}/place/${id}`));
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(res => res.json()));

      const placesWithImages = await Promise.all(data.map(async place => {
        if (place.acf.image) {
          place.mapImage = await fetchImage(place.acf.image, "full");
        }
        return place;
      }));
      return placesWithImages;
    } catch (error) {
      console.error('Error fetching places', error);
      throw error;
    }
  }

  const toggleMapView = () => {
    if (!arePlacesFetched) return false;
    isMapView = !isMapView;
  }

  const handleScroll = () => {
    isPageScrolled.set(scrollDiv.scrollTop > 50);
  };

  onMount(() => {
    fetchPlaces().then(data => {
      places = data.map(place => {
        return {
          raw: place,
          id: place.id,
          location: {
            lat: place.acf.latitude,
            lng: place.acf.longitude,
          },
          excerpt: place.acf.excerpt,
          title: place.title.rendered,
          beforeArrival: place.acf.before_arrival,
          whenArrived: place.acf.after_arrival,
          arLink: place.acf.ar_url,
          image: place.acf.image,
          content: place.acf.description,
          videoLink: place.acf.video,
          audioLink: place.acf.vo_file,
          tags: place.tags.map(tag => tag.name),
          mapImage: place.mapImage || null,
        }
      });
      arePlacesFetched = true;

      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition((position) => {
          places = places.map(place => ({
            ...place,
            distance: Math.round(
              calculateDistance(
                position.coords.latitude, 
                position.coords.longitude, 
                place.location.lat, 
                place.location.lng))
          }));
        });
      }
    })

    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll);
    }

    parsedHTML = updateVideoTags(htmlContent);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }

      isPageScrolled.set(false);
      if (scrollDiv) {
        scrollDiv.removeEventListener('scroll', handleScroll);
      }
    }
  });
</script>
{#if isMapView && arePlacesFetched}
  <div class="flex flex-col w-full h-full absolute top-0 left-0 bg-white z-40 overflow-hidden">
    <WhatsOnMap places={places} />
    <button class="absolute top-10 left-[50%] -translate-x-[50%] text-[16px]/[16px] font-bold bg-white py-3 px-3 rounded-full shadow-md" on:click={toggleMapView}>See list view</button>
  </div>
{:else}
  <div bind:this={scrollDiv} class="flex flex-col w-full h-full absolute top-0 left-0 bg-white overflow-y-scroll">
    <div class="relative">
      <Image imageId={detailImage} placeholderImage={detailImagePlaceholder} alt={title} imageSize="full" />
      <div class="absolute top-0 left-0 w-full h-full" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.00) 70%);"></div>
      <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute -bottom-12 right-0">
    </div>
    <div class="px-6 py-9">
      <a href="/whats-on" class="flex gap-2 font-semibold text-lg"><img src="/Black_Arrow.svg">What's on</a>
      <h1 class="text-3xl font-bold pt-[18px]">{title}</h1>
      <div class="flex gap-2 pt-2">
        {#if dateStart}
          <span class="text-primary text-bold text-sm ">{dateStart}</span>
        {/if}
        {#if dateEnd}
          <span class="text-primary text-bold text-sm">-</span>
          <span class="text-primary text-bold text-sm">{dateEnd}</span>
        {/if}
      </div>
      <div class="pt-6 mt-6 border-t-neutral-content border-t-[1px]">
        <Prose>{@html parsedHTML}</Prose>
      </div>
      <div class="flex justify-center py-8">
        <Button handleClick={toggleMapView}>
          {#if arePlacesFetched}
            See map view
          {:else}
            <span class="loading loading-spinner"></span>
            Loading...
          {/if}
        </Button>
      </div>
      <div class="flex flex-col">
        {#if arePlacesFetched}
          {#each places as place}
            <PlacesCard 
              title={place.title} 
              description={place.excerpt}
              image={place.image}
              href={`/places/${place.id}`}
              distance={place.distance}
            />
          {/each}
        {:else}
          <div class="flex justify-center gap-2">
            <span class="loading loading-spinner"></span>
            Loading...
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}