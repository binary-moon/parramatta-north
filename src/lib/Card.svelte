<script lang="ts">
  import Pill from "./Pill.svelte";

  export let tags: string;
  export let title: string;
  export let subtitle: string;
  export let image: string;
  export let href: string = "/";
  export let isLargeTitle: boolean = false;

  const placeholderImage = "https://placehold.co/1080x1080/black/333";
  const backgroundImage = image || placeholderImage
</script>
<a href={href} class="relative flex flex-col justify-end items-start gap-2 h-[289px] w-full overflow-hidden rounded-[60px] px-6 py-9 bg-cover bg-center" style="background-image: url('{backgroundImage}');">
  {#if tags && (tags.length > 0)}
    <div class="flex gap-2">
      {#each tags as tag}
        <Pill text={tag} />
      {/each}
    </div>
  {/if}
  {#if title}
    <h1 class={`text-white ${isLargeTitle ? 'text-3xl' : 'text-[22px]/[28px]'} text-3xl font-bold`}>{title}</h1>
  {/if}
  {#if subtitle}
    <span class="text-white text-sm">{subtitle}</span>
  {/if}
</a>