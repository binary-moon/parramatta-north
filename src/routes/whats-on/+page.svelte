<script lang="ts">
  import Card from '$lib/Card.svelte';

  import type { IWhatsOn } from '$lib/types';

  export let data;
  const { events: whatsOns } = data;
</script>
  
<div class="flex flex-col gap-6 pt-16 pb-6 -mt-8 relative">
  <h2 class="text-3xl text-primary px-6 font-bold">What's on</h2>
  <div class="flex flex-col px-6 gap-6">
    {#each whatsOns as whatsOn}
      <Card {...whatsOn} isLargeTitle />
    {/each}
  </div>
  <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute top-0 right-0">
  <img src="/Promo_Deco_2.svg" alt="Promo decoration" class="absolute top-[470px] left-0">
</div>
  