<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  import { isPageScrolled } from '$lib/store';
  import { loadScript } from '$lib/utilities/loadScript';
  import { updateVideoTags } from '$lib/utilities/htmlParser';

  import Pill from '$lib/Pill.svelte';
  import Prose from '$lib/Prose.svelte';
  import Button from '$lib/Button.svelte';
  import PlaceMap from '$lib/PlaceMap.svelte';
  import Image from "$lib/Image.svelte";
  import Video from '$lib/Video.svelte';
  import Audio from '$lib/Audio.svelte';

  let isMapView: boolean = false;
  let watchId: number | null = null;
  let distance: number | null = null;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let isGoogleMapsLoaded: boolean = false;
  const detailImagePlaceholder = 'https://placehold.co/1284x1080/black/333';
  const mapImagePlaceholder = 'https://placehold.co/255x255/black/333';

  let scrollDiv: HTMLDivElement;
  
  export let data: PageData;
  const { pageData } = data;

  let parsedHTML: string;

  console.log({pageData})

  const toggleMap = () => {
    isMapView = !isMapView;
  }

  const handleScroll = () => {
    isPageScrolled.set(scrollDiv.scrollTop > 50);
  };

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`, async () => {
      isGoogleMapsLoaded = true
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition((position) => {
          const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(userLocation, pageData.location));
        }, null, { enableHighAccuracy: true });
      }
    });

    if (scrollDiv) {
      scrollDiv.addEventListener('scroll', handleScroll);
    }

    parsedHTML = updateVideoTags(pageData.htmlContent);

    return () => {
      isPageScrolled.set(false);
      if (scrollDiv) {
        scrollDiv.removeEventListener('scroll', handleScroll);
      }
    };
  })
</script>
{#if pageData}
  {#if isMapView && isGoogleMapsLoaded}
    <div class="flex flex-col w-full h-full absolute top-0 left-0 bg-white z-40 overflow-hidden">
      <PlaceMap location={pageData.location} title={pageData.title} image={pageData.mapImage || mapImagePlaceholder} />
    </div>
  {:else}
    <div bind:this={scrollDiv} class="flex flex-col w-full h-full absolute top-0 left-0 bg-white overflow-y-scroll pb-[100px]">
      <div class="relative">
        <Image imageId={pageData.detailImage} placeholderImage={detailImagePlaceholder} alt={pageData.title} />
        <div class="absolute top-0 left-0 w-full h-full" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.00) 70%);"></div>
        <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute -bottom-12 right-0">
      </div>
      <div class="px-6 py-9">
        <a href="/places" class="flex gap-2 font-semibold text-lg"><img src="/Black_Arrow.svg"> All Places</a>
        {#if pageData.tags && (pageData.tags.length > 0)}
          <div class="flex gap-2 pt-6">
            {#each pageData.tags as tag}
              <Pill text={tag} />
            {/each}
          </div>
        {/if}
        <h1 class="text-3xl font-bold pt-[18px]">{pageData.title}</h1>
        {#if distance}
          <span class="text-primary text-bold text-sm pt-2">{distance} metres away</span>
        {/if}
        {#if parsedHTML}
          <div class="pt-6 mt-6 border-t-neutral-content border-t-[1px]">
            <Prose>{@html parsedHTML}</Prose>
          </div>
        {/if}
        {#if pageData.video && pageData.video !== ''}
          <Video videoId={pageData.video} classes="mt-6" />
        {/if}
        {#if pageData.audio && pageData.audio !== ''}
          <Audio audioId={pageData.audio} classes="mt-6" />
        {/if}
      </div>
    </div>
  {/if}
  <!-- <div class="flex flex-col fixed px-6 pb-[60px] bottom-0 left-0 w-full z-50">
    <Button handleClick={toggleMap}>{isMapView ? 'Close map' : 'See on map'}</Button>
  </div> -->
{/if}