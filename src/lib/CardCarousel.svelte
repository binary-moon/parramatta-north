<script lang="ts">
  import type { ICard } from "$lib/types"
  import Card from "./Card.svelte";
  import Dot from "./Dot.svelte";

  export let items: ICard[];
</script>

<div>
  <div class="carousel carousel-center w-full p-6 space-x-6">
    {#each items as item, i}
      <div id="item{i}" class="carousel-item w-3/4">
        <Card {...item} />
      </div>
    {/each}
  </div>
  <div class="flex justify-center w-full py-2 gap-2">
    {#each items as item, i}
      <a href="#item{i}"><Dot /></a> 
    {/each}
  </div>
</div>

