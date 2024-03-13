<script lang="ts">
  import SectionTitle from "./SectionTitle.svelte";
  import NewsCard from "./NewsCard.svelte";

  import type { ILatestNews } from "$lib/types";

  export let title: string;
  export let moreLink: string;
  export let items: ILatestNews[];
</script>
<div class="flex flex-col">
  <SectionTitle {title} {moreLink} />
  <div class="px-6">
    {#each items as {date, title, description, image, href}}
      <NewsCard {date} {title} {description} {image} {href} />
    {/each}
  </div>
</div>