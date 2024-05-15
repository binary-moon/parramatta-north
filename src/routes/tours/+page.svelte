<script lang="ts">
  import { onMount } from 'svelte';

  import Filter from '$lib/Filter.svelte';
  import Card from '$lib/Card.svelte';

  import { activeFilter } from '$lib/store';

  import type { ITour } from '$lib/types';

  export let data;

  const { tours, filterOptions } = data;
  
  let filteredTours: ITour[] = [];
  
  activeFilter.set('All');

  $: filteredTours = $activeFilter === 'All' ? tours : tours.filter(tour => tour.tags.includes($activeFilter))
</script>

<div class="flex flex-col gap-6 pb-6 relative">
  <Filter {filterOptions} />
  <div class="px-6">Take a self-guided digital tour full of compelling stories and features.</div>
  <div class="flex flex-col px-6 gap-6">
    {#each filteredTours as tour (tour.id)}
      <Card {...tour} isLargeTitle />
    {/each}
  </div>
  <img src="/Promo_Deco_1.svg" alt="Promo decoration" class="absolute top-14 right-0">
  <img src="/Promo_Deco_2.svg" alt="Promo decoration" class="absolute top-[470px] left-0">
</div>
