<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';

    import Prose from '$lib/Prose.svelte';
    import Image from '$lib/Image.svelte';

    import { isPageScrolled } from '$lib/store';

    let scrollDiv: HTMLDivElement;
    
    export let data: PageData;

    const detailImagePlaceholder = "https://placehold.co/1284x1080/black/333"

    const { detailImage, title, date, htmlContent } = data.pageData;

    const handleScroll = () => {
      isPageScrolled.set(scrollDiv.scrollTop > 50);
    };

    onMount(() => {
      if (scrollDiv) {
        scrollDiv.addEventListener('scroll', handleScroll);
      }

      return () => {
        isPageScrolled.set(false);
        if (scrollDiv) {
          scrollDiv.removeEventListener('scroll', handleScroll);
        }
      };
    });
</script>
<div bind:this={scrollDiv} class="flex flex-col w-full h-full absolute top-0 left-0 bg-white overflow-y-scroll pb-[100px]">
  <div class="relative">
    <Image imageId={detailImage} placeholderImage={detailImagePlaceholder} alt={title} />
    <div class="absolute top-0 left-0 w-full h-full" style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.00) 70%);"></div>
    <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute -bottom-12 right-0">
  </div>
  <div class="flex flex-col px-6 py-9">
    <a href="/latest-news" class="flex gap-2 font-semibold text-lg"><img src="/Black_Arrow.svg"> All news</a>
    <span class="text-primary text-bold text-sm pt-2">{date}</span>
    <h1 class="text-3xl font-bold pt-[18px]">{title}</h1>
    <div class="pt-6 mt-6 border-t-neutral-content border-t-[1px]">
      <Prose>{@html htmlContent}</Prose>
    </div>
  </div>
</div>