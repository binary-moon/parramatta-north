<script lang="ts">
  import Pill from "./Pill.svelte";

  import BackgroundImage from "./BackgroundImage.svelte";

  export let tags: string;
  export let title: string;
  export let subtitle: string;
  export let image: number;
  export let href: string = "/";
  export let isLargeTitle: boolean = false;

  const placeholderImage = "https://placehold.co/1080x1080/black/333";

  import { decodeHtmlEntities } from "./utilities/htmlParser";
</script>
<a href={href}>
  <BackgroundImage 
    classes="overflow-hidden rounded-[60px]"
    imageId={image}
    placeholderImage={placeholderImage}
  >
    <div class="relative flex flex-col justify-end items-start gap-2 h-[289px] w-full px-6 py-9" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 69.12%);">
      {#if tags && (tags.length > 0)}
        <div class="flex gap-2">
          {#each tags as tag}
            <Pill text={tag} />
          {/each}
        </div>
      {/if}
      {#if title}
        <h1 class={`text-white ${isLargeTitle ? 'text-3xl' : 'text-[22px]/[28px]'} text-3xl font-bold`}>{decodeHtmlEntities(title)}</h1>
      {/if}
      {#if subtitle}
        <span class="text-white text-sm">{subtitle}</span>
      {/if}
    </div>
  </BackgroundImage>
</a>