<script lang="ts">
  import { onMount } from 'svelte';

  import Pill from "./Pill.svelte";
  import Prose from "./Prose.svelte";

  import { updateVideoTags } from '$lib/utilities/htmlParser';

  export let activePlace: number;
  export let places: any[];

  $: place = places[activePlace];

  let isPlaceExpanded = false;
  let parsedHTML: string;

  $: translateYValue = isPlaceExpanded ? '0' : '75%';
  $: transformValue = `translate3d(0, ${translateYValue}, 0)`;
  $: width = 'calc(100% - 1.5rem)';
  $: height = 'calc(100% - 3rem)';
  $: styles = `transform: ${transformValue}; width: ${width}; height: ${height};`;

  const imagePlaceholder = "https://placehold.co/760x640/black/333";
  $: ({ title, image, tags, distance, content, mapImage } = place);

  const handleDetailToggle = () => {
    isPlaceExpanded = !isPlaceExpanded;
  }

  onMount(() => {
    parsedHTML = updateVideoTags(content);
  });
</script>
<div class="absolute top-12 left-3 transition-transform duration-300 ease-in-out" style={styles}>
  <button class="flex flex-col items-stretch w-full h-full bg-white rounded-[5px] px-6 py-11 overflow-y-scroll text-left" on:click={handleDetailToggle}>
    {#if tags && (tags.length > 0)}
      <div class="flex gap-2">
        {#each tags as tag}
          <Pill text={tag} />
        {/each}
      </div>
    {/if}
    <h4 class="text-[22px]/[28px] font-bold mt-3">{title}</h4>
    {#if distance} 
      <span class="text-primary text-sm font-bold">{`${distance} meters away`}</span>
    {/if}
    <img src={mapImage || imagePlaceholder} alt={title} class="w-full mt-6 rounded-[12px]" />
    <div class="mt-6">
      <Prose>{@html parsedHTML}</Prose>
    </div>
  </button>
</div>