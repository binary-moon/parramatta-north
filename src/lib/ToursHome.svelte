<script lang="ts">
  import CardCarousel from "./CardCarousel.svelte";
  import SectionTitle from "./SectionTitle.svelte";

  import type { ICard } from "$lib/types"

  export let title: string;
  export let moreLink: string;
  export let items: ICard[];
</script>
<div class="relative pt-4 pb-6">
  <SectionTitle {title} {moreLink} />
  <CardCarousel {items} />
  <img class="absolute -top-0 left-0 -z-10" src="/Tours_Deco.svg" alt="decoration"/>
</div>