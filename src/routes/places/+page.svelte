<script lang="ts">
  import { onMount } from 'svelte';
  import Filter from '$lib/Filter.svelte';
  import PlacesCard from '$lib/PlacesCard.svelte';
  import { activeFilter } from '$lib/store';
  import { calculateDistance } from '$lib/utilities/calculations';
  import type { IPlace } from '$lib/types';

  const theme = import.meta.env.VITE_THEME;

  let title = ''
  if (theme === 'parramattaNorth') {
    title = 'Find and explore places and points of interest at Parramatta North.'
  } else if (theme === 'rgb') {
    title = 'Find and explore places and points of interest at Registrar General\'s Bulding.'
  }

  export let data;
  const { places: originalPlaces, filterOptions } = data;

  let places: IPlace[] = [...originalPlaces];
  let watchId: number | null;

  activeFilter.set('All');

  onMount(() => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        places = places.map(place => ({
          ...place,
          distance: Math.round(
            calculateDistance(
              position.coords.latitude, 
              position.coords.longitude, 
              place.location.latitude, 
              place.location.longitude))
        }));
      });
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    }
  });

  $: filteredPlaces = ($activeFilter === 'All' ? places : places.filter(place => place.tags.includes($activeFilter))).sort((a, b) => a.distance - b.distance);
</script>

<div class="flex flex-col gap-6 pb-6 relative">
  {#if theme !== 'rgb'}
    <Filter {filterOptions} />
  {/if}
  
  <div class="px-6">{title}</div>
  <div class="flex flex-col px-6">
    {#each filteredPlaces as place (place.id)}
      <PlacesCard {...place} />
    {/each}
  </div>
</div>