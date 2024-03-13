<script lang="ts">
    import { onMount } from 'svelte';
    import data from './data.json';

    import type { IFaq } from '$lib/types';
    import Collapsible from '$lib/Collapsible.svelte';

    let faqs: IFaq[] = [];

    onMount(async () => {
      faqs = data
    });
</script>
<div class="flex flex-col pt-16 pb-6 -mt-8 relative px-6 gap-8">
  <h2 class="text-3xl text-primary font-bold">FAQs</h2>
  <p class="text-base/[22px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus ullamcorper nunc, vitae sollici tudin dolor accumsan id. </p>
  <div class="flex flex-col gap-8">
    {#each faqs as {question, answer}}
      <Collapsible title={question} content={answer} />
    {/each}
  </div>
  <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute top-0 right-0">
</div>