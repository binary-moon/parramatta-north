<script lang="ts">
  import { onMount } from 'svelte';

  import Button from '$lib/Button.svelte';
  import Pill from '$lib/Pill.svelte';
  import Tour from '$lib/Tour.svelte';
  import BackgroundImage from '$lib/BackgroundImage.svelte';

  import type { PageData } from './$types';
  import { activeFilter, isTourStarted } from '$lib/store';
  
  export let data: PageData;

  let places = [];
  const detailImagePlaceholder = 'https://placehold.co/2000x2000/black/333'
  const apiUrl = import.meta.env.VITE_API_URL;
  let arePlacesFetched = false;

  const { pageData } = data;

  const fetchPlaces = async () => {
    try {
      const promises = pageData.places.map(id => fetch(`${apiUrl}/place/${id}`));
      const responses = await Promise.all(promises);
      const data = await Promise.all(responses.map(res => res.json()));
      return data;
    } catch (error) {
      console.error('Error fetching places', error);
      throw error;
    }
  }

  const startTour = () => {
    if (!arePlacesFetched) return;
    isTourStarted.set(true)
  }

  onMount(() => {
    fetchPlaces().then(data => {
      places = data.map(place => {
        return {
          id: place.id,
          location: {
            lat: place.acf.latitude,
            lng: place.acf.longitude,
          },
          title: place.title.rendered,
          beforeArrival: place.acf.before_arrival,
          whenArrived: place.acf.after_arrival,
          arLink: place.acf.ar_url,
          image: place.acf.image,
          content: place.acf.description,
          videoLink: place.acf.video,
          audioLink: place.acf.vo_file,
        }
      });
      arePlacesFetched = true;
    })
  });
</script>

{#if pageData}
  {#if $isTourStarted}
    <div class="flex flex-col w-full h-full absolute top-0 left-0 bg-white z-40 overflow-hidden">
      <Tour tourSteps={places} title={pageData.title} defaultLocation={places[0].location}/>
    </div>
  {:else}
    <BackgroundImage
      classes="flex w-full h-full absolute top-0 left-0 text-white"
      imageId={pageData.image}
      placeholderImage={detailImagePlaceholder}
    >
      <div class="w-full h-full absolute top-0 left-0 flex flex-col justify-end" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 80.35%)">
        <div class="flex flex-col p-6 pb-[62px]">
          <a href="/tours" class="flex gap-2 font-semibold"><img src="/White_Arrow.svg"> See all tours</a>
          <h1 class="text-5xl/[58px] font-bold mt-3">{pageData.title}</h1>
          <span class="text-sm mt-3">{pageData.subtitle}</span>
          <div class="flex flex-wrap gap-3 mt-5">
            {#if pageData.tags}
              {#each pageData.tags as tag}
                <Pill text={tag} type="white" />
              {/each}
            {/if}
          </div>
          {#if pageData.content && pageData.content !== ""}
            <p class="mt-6">{pageData.content}</p>
          {/if}
          <Button buttonStyle="primary" additionalClasses="mt-10" handleClick={startTour}>
            {#if arePlacesFetched}
              Start tour now
            {:else}
              <span class="loading loading-spinner"></span>
              Loading...
            {/if}
          </Button>
        </div>
      </div>
    </BackgroundImage>
  {/if}
{/if}