<script lang="ts">
    import { onMount } from 'svelte';
    import data from './data.json';

    import GettingHereCard from '$lib/GettingHereCard.svelte';

    import type { IGettingHere } from '$lib/types';

    let gettingHereList: IGettingHere[] = [];

    onMount(async () => {
      gettingHereList = data
    });
</script>
<div class="flex flex-col pt-16 pb-6 -mt-8 relative">
  <h2 class="text-3xl text-primary px-6 font-bold">Getting here</h2>
  <div class="flex flex-col px-6">
    {#each gettingHereList as gettingHere}
      <GettingHereCard {...gettingHere} />
    {/each}
  </div>
  <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute top-0 right-0">
</div>
