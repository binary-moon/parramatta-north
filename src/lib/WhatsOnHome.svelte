<script lang="ts">
  import CardCarousel from "./CardCarousel.svelte";
  import SectionTitle from "./SectionTitle.svelte";

  import type { ICard } from "$lib/types"

  export let title: string;
  export let moreLink: string;
  export let items: ICard[];
</script>
<div class="relative pb-9">
  <SectionTitle {title} {moreLink} />
  <CardCarousel {items} />
  <img class="absolute bottom-0 right-0" src="/WhatsOnHomeDeco.png" alt="decoration"/>
</div>