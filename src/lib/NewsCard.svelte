<script lang="ts">
  import Image from "./Image.svelte";

  export let date: string;
  export let title: string;
  export let description: string;
  export let image: number;
  export let href: string;

  const placeholderImage = 'https://placehold.co/396x297/black/333';
</script>
<a href={href}>
  <div class="flex flex-col gap-6 py-6 border-b-neutral-content border-b-[1px] border-solid">
    <div class="flex gap-4 justify-between items-start">
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">{date}</span>
        <span class="text-[22px]/[28px] font-bold">{title}</span>
      </div>
      <Image imageId={image} placeholderImage={placeholderImage} alt={title} classes="w-[132px] rounded-[30px] block"/>
    </div>
    <span class="text-base">{description}</span>
  </div>
</a>