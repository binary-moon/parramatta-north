<script lang="ts">
  import NewsCard from '$lib/NewsCard.svelte';

  import type { ILatestNews } from '$lib/types';
  
  export let data;

  const { latestNews } = data;
</script>

<div class="flex flex-col pt-16 pb-6 -mt-8 relative">
  <h2 class="text-3xl text-primary px-6 font-bold">Latest news</h2>
  <div class="flex flex-col px-6">
    {#each latestNews as news}
      <NewsCard {...news} />
    {/each}
  </div>
  <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute top-0 right-0">
</div>