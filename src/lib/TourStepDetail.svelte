<script lang="ts">
  import Button from './Button.svelte';
  import Prose from './Prose.svelte';
  import Image from './Image.svelte';

  import { areTourDetailsExpanded } from "./store";

  import type { ITourStep } from './types';

  export let details: ITourStep;
  export let title: string;
  export let index: number;

  const imagePlaceholder = "https://placehold.co/760x640/black/333";

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('Audio Click');
  }

  const handleDetailToggle = () => {
    areTourDetailsExpanded.set(!$areTourDetailsExpanded)
  }

</script>
<button class="flex flex-col items-stretch w-full h-full bg-white rounded-[5px] px-6 pt-11 overflow-y-scroll text-left" on:click={handleDetailToggle}>
  <div class="w-20 h-1 bg-[#495054] rounded absolute top-4 left-1/2 -translate-x-1/2"></div>
  <div class="flex gap-2">
    <span class="w-[26px] h-[26px] bg-primary rounded-full text-white text-sm/[26px] font-bold text-center">{index + 1}</span>
    <span class="text-primary text-sm/[26px] font-bold">{title}</span>
  </div>
  <h4 class="text-[22px]/[28px] font-bold mt-3">{details.title}</h4>
  <Image imageId={details.image} placeholder={imagePlaceholder} alt={details.title} classes="w-full mt-6 rounded-[12px]" />
  <div class="flex flex-col gap-3 bg-neutral-content p-6 rounded-[12px] mt-6">
    <div class="flex gap-3">
      <img src="/Arrival_Icon.svg" alt="Arrival Icon" />
      <span class="text-lg font-bold">When you arrive...</span>
    </div>
    <div class="text-base">{details.beforeArrival}</div>
  </div>
  {#if details.audioLink && details.audioLink.length > 0}
    <Button buttonStyle="neutral" additionalClasses="mt-6" handleClick={handleAudioClick} isOutline>
      <img src="/Icon_Audio.svg" alt="Audio"/> Listen to audio description
    </Button>
  {/if}
  <div class="mt-6">
    <Prose>{@html details.content}</Prose>
  </div>
</button>