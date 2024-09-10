<script lang="ts">
  import NewsCard from "./NewsCard.svelte";

  import type { ILatestNews } from "$lib/types";

  export let title: string;
  export let moreLink: string;
  export let items: ILatestNews[];

  console.log(items)
</script>
<div class="flex flex-col">
  <div class="px-6">
    {#each items as {date, title, description, image, href}}
      <NewsCard {date} {title} {description} {image} {href} />
    {/each}
  </div>
</div>