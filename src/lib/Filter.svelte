<script lang="ts">
  import FilterButton from "./FilterButton.svelte";
  import { activeFilter } from '$lib/store';

  export let filterOptions: string[];

  const handleFilter = (option: string) => {
    activeFilter.set(option)
  }
</script>
<div>
  <div class="carousel carousel-center w-full px-6 space-x-2">
  {#each filterOptions as option}
    <div class="carousel-item">
      <FilterButton text={option} isActive={option === $activeFilter} {handleFilter} />
    </div>
  {/each}
  </div>
</div>