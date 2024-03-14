<script lang="ts">
  import Button from '$lib/Button.svelte';
  import Pill from '$lib/Pill.svelte';
  import Tour from '$lib/Tour.svelte';

  import type { PageData } from './$types';
  import { isTourStarted } from '$lib/store';
  
  export let data: PageData;

  const { pageData } = data;
  console.log({pageData})

  const startTour = () => {
    isTourStarted.set(true)
  }
</script>

{#if pageData}
  {#if $isTourStarted}
    <div class="flex flex-col w-full h-full absolute top-0 left-0 bg-white z-40 overflow-hidden">
      <Tour tourSteps={pageData.tourSteps} title={pageData.title} defaultLocation={pageData.defaultLocation}/>
    </div>
  {:else}
    <div class="flex flex-col justify-end w-full h-full absolute top-0 left-0 bg-cover bg-center text-white" style="background-image: url('{pageData.detailImage}');">
      <div class="flex flex-col p-6 pb-[62px]">
        <a href="/tours" class="flex gap-2 font-semibold"><img src="/White_Arrow.svg"> See all tours</a>
        <h1 class="text-5xl/[58px] font-bold mt-3">{pageData.title}</h1>
        <span class="text-sm mt-3">{pageData.subtitle}</span>
        <div class="flex flex-wrap gap-3 mt-5">
          {#each pageData.detailTags as tag}
            <Pill text={tag} type="white" />
          {/each}
        </div>
        <p class="mt-6">{pageData.description}</p>
        <Button buttonStyle="primary" additionalClasses="mt-10" handleClick={startTour}>Start tour now</Button>
      </div>
    </div>
  {/if}
{/if}