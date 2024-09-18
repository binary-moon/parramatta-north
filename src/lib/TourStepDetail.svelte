<script lang="ts">
  import { onMount } from 'svelte';

  import Button from './Button.svelte';
  import Prose from './Prose.svelte';
  import Image from './Image.svelte';

  import { updateVideoTags } from './utilities/htmlParser';
  import { areTourDetailsExpanded, isARActive, activeARURL } from "./store";

  import type { ITourStep } from './types';

  export let details: ITourStep;
  export let title: string;
  export let index: number;
  export let isArrived: boolean;

  console.log(details)

  let parsedHTML: string;
  let startY: number = 0;
  let endY: number = 0;

  const imagePlaceholder = "https://placehold.co/760x640/black/333";
  const { title: placeTitle, whenArrived, beforeArrival, content, image, audioLink, arLink } = details;

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('Audio Click');
  }

  const handleDetailToggle = () => {
    areTourDetailsExpanded.set(!$areTourDetailsExpanded)
  }

  const handleArClick = async (event: MouseEvent) => {
    event.stopPropagation();

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Request gyroscope permission
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          // Permissions granted, set the store values
          isARActive.set(true);
          activeARURL.set(arLink);
        } else {
          // Permissions denied, handle accordingly (e.g., show an error message)
          console.error('Gyroscope permission denied');
        }
      } else {
        // Gyroscope permission not supported, set the store values
        isARActive.set(true);
        activeARURL.set(arLink);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }

  const handleTouchStart = (event: TouchEvent) => {
    startY = event.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum swipe distance to consider it a swipe
    const swipeDistance = endY - startY;

    if (swipeDistance < -swipeThreshold) {
      // Swipe up
      areTourDetailsExpanded.set(true)
    } else if (swipeDistance > swipeThreshold) {
      // Swipe down
      areTourDetailsExpanded.set(false)
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    endY = event.touches[0].clientY;
  };

  onMount(() => {
    parsedHTML = updateVideoTags(content);
  });
</script>
<button class="flex flex-col items-stretch w-full h-full bg-white rounded-[5px] px-6 pt-11 pb-4 overflow-y-scroll text-left" 
  on:click={handleDetailToggle} 
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}>
  <div class="w-20 h-1 bg-[#495054] rounded absolute top-4 left-1/2 -translate-x-1/2"></div>
  <div class="flex gap-2">
    <span class="w-[26px] h-[26px] bg-primary rounded-full text-white text-sm/[26px] font-bold text-center">{index + 1}</span>
    <span class="text-primary text-sm/[26px] font-bold">{@html title}</span>
  </div>
  <h4 class="text-[22px]/[28px] font-bold mt-3">{placeTitle}</h4>
  {#if isArrived}
    <div class="flex flex-col gap-3 bg-neutral-content p-6 rounded-[12px] mt-6">
      <div class="flex gap-3">
        <img src="/Arrival_Icon.svg" alt="Arrival Icon" />
        <span class="text-lg font-bold">You are here!</span>
      </div>
      <div class="text-base">{whenArrived}</div>
      {#if arLink && arLink.length > 0 }
        <Button buttonStyle="primary" additionalClasses="mt-2" handleClick={handleArClick}>View AR experience now</Button>
      {/if}
    </div>
  {/if}
  <Image imageId={image} placeholder={imagePlaceholder} alt={title} classes="w-full mt-6 rounded-[12px]" />
  {#if !isArrived}
    <div class="flex flex-col gap-3 bg-neutral-content p-6 rounded-[12px] mt-6">
      <div class="flex gap-3">
        <img src="/Arrival_Icon.svg" alt="Arrival Icon" />
        <span class="text-lg font-bold">When you arrive...</span>
      </div>
      <div class="text-base">{beforeArrival}</div>
    </div>
  {/if}
  {#if isArrived}
    {#if audioLink && audioLink.length > 0}
      <Button buttonStyle="neutral" additionalClasses="mt-6" handleClick={handleAudioClick} isOutline>
        <img src="/Icon_Audio.svg" alt="Audio"/> Listen to audio description
      </Button>
    {/if}
    <div class="mt-6">
      <Prose>{@html parsedHTML}</Prose>
    </div>
  {/if}
</button>