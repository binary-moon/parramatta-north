<script lang="ts">

import Pill from "./Pill.svelte";
  import Image from "./Image.svelte";

  export let title: string;
  export let description: string;
  export let distance: string;
  export let image: number;
  export let href: string;
  export let tags: string[] = [];

  const placeholderImage = "https://placehold.co/396x297/black/333"
</script>
<a href={href}>
  <div class="flex flex-col gap-6 py-6 border-b-neutral-content border-b-[1px] border-solid">
    <div class="flex gap-4 justify-between items-start">
      <div class="flex flex-col gap-3">
        {#if tags && (tags.length > 0)}
          <div class="flex gap-2">
            {#each tags as tag}
              <Pill text={tag} />
            {/each}
          </div>
        {/if}
        <span class="text-[22px]/[28px] font-bold">{title}</span>
        {#if description}
          <span class="text-base/[22px]">{description}</span>
        {/if}
        {#if distance} 
          <span class="text-primary text-sm font-bold">{`${distance} meters away`}</span>
        {/if}
      </div>
      <Image imageId={image} placeholderImage={placeholderImage} alt={title} classes="w-[132px] rounded-[30px] block"/>
    </div>
  </div>
</a>