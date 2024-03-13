<script lang="ts">
  import Button from './Button.svelte';

  import { areTourDetailsExpanded } from "./store";

  import type { ITourStep } from './types';

  export let details: ITourStep;
  export let title: string;
  console.log({details})

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('Audio Click');
  }

  const handleDetailToggle = () => {
    console.log($areTourDetailsExpanded)
    areTourDetailsExpanded.set(!$areTourDetailsExpanded)
  }

</script>
<button class="flex flex-col w-full h-full bg-white rounded-[5px] px-6 pt-11 overflow-y-scroll text-left" on:click={handleDetailToggle}>
  <div class="w-20 h-1 bg-[#495054] rounded absolute top-4 left-1/2 -translate-x-1/2"></div>
  <div class="flex gap-2">
    <span class="w-[26px] h-[26px] bg-primary rounded-full text-white text-sm/[26px] font-bold text-center">{details.step}</span>
    <span class="text-primary text-sm/[26px] font-bold">{title}</span>
  </div>
  <h4 class="text-[22px]/[28px] font-bold mt-3">{details.title}</h4>
  <img src={details.image} alt={details.title} class="w-full mt-6 rounded-[12px]" />
  <div class="flex flex-col gap-3 bg-neutral-content p-6 rounded-[12px] mt-6">
    <div class="flex gap-3">
      <img src="/Arrival_Icon.svg" alt="Arrival Icon" />
      <span class="text-lg font-bold">When you arrive...</span>
    </div>
    <div class="text-base">{details.beforeArrival}</div>
  </div>
  <Button buttonStyle="neutral" additionalClasses="mt-6" handleClick={handleAudioClick} isOutline>
    <img src="/Icon_Audio.svg" alt="Audio"/> Listen to audio description
  </Button>
  <div class="prose mt-6">{@html details.content}</div>
</button>