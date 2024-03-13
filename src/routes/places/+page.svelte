<script lang="ts">
  import { onMount } from 'svelte';
  import data from './data.json';

  import Filter from '$lib/Filter.svelte';
  import PlacesCard from '$lib/PlacesCard.svelte';

  import { activeFilter } from '$lib/store';

  import type { IPlace } from '$lib/types';

  let places: IPlace[] = [];
  let filteredPlaces: IPlace[] = [];
  let filterOptions: string[] = ['All'];  

  onMount(async () => {
    places = data;
    filterOptions = [...filterOptions, ...new Set(places.map(place => place.tag))]
    console.log({places})

    activeFilter.set('All');
  });

  $: filteredPlaces = $activeFilter === 'All' ? places : places.filter(place => place.tag === $activeFilter)
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