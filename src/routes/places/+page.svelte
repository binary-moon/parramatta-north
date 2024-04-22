<script lang="ts">
  import { onMount } from 'svelte';
  import Filter from '$lib/Filter.svelte';
  import PlacesCard from '$lib/PlacesCard.svelte';
  import { activeFilter } from '$lib/store';
  import { calculateDistance } from '$lib/utilities/calculations';
  import type { IPlace } from '$lib/types';

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
  <Filter {filterOptions} />
  <div class="px-6">Find and explore places and points of interest at Parramatta North.</div>
  <div class="flex flex-col px-6">
    {#each filteredPlaces as place}
      <PlacesCard {...place} />
    {/each}
  </div>
</div>