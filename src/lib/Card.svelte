<script lang="ts">
  import Pill from "./Pill.svelte";

  export let tag: string;
  export let title: string;
  export let subtitle: string;
  export let image: string;
  export let href: string = "/";
  export let isLargeTitle: boolean = false;
</script>
<a href={href} class="relative flex flex-col justify-end items-start gap-2 h-[289px] w-full overflow-hidden rounded-[60px] px-6 py-9 bg-cover bg-center" style="background-image: url('{image}');">
  <Pill text={tag} />
  <h1 class={`text-white ${isLargeTitle ? 'text-3xl' : 'text-[22px]/[28px]'} text-3xl font-bold`}>{title}</h1>
  <span class="text-white text-sm">{subtitle}</span>
</a>