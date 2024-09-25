<script lang="ts">
  import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  import BackgroundImage from '$lib/BackgroundImage.svelte';
  import Button from './Button.svelte';

  import { isAcknowledgementVisible } from './store';

  const detailImagePlaceholder = 'https://placehold.co/2000x2000/black/333'

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('Audio Click');
  }

  const handleContinue = () => {
    isAcknowledgementVisible.set(false);
  }
</script>
<div class="flex w-full h-full absolute top-0 left-0 text-white" transition:scale={{ duration: 600, opacity: 0, start: 0.8, easing: quintOut}}>
  <BackgroundImage
    classes="flex w-full h-full absolute top-0 left-0 text-white"
    hardcodedImage="/AoC_Image.png"
    placeholderImage={detailImagePlaceholder}
  >
    <div class="flex w-full h-full absolute top-0 left-0 bg-black bg-opacity-60">
      <div class="flex flex-col p-6 pt-48 gap-6">
        <button on:click={handleAudioClick} class="flex gap-2 items-center text-sm font-bold underline">
          <img src="/Audio_Description_ Icon.svg" alt="Audio"/> Listen to audio description
        </button>
        <div class="relative flex flex-col gap-6 overflow-y-scroll pb-12">
          <p>Beneath the silent echoes of wandering constellations, the fragmented whispers of forgotten rivers linger in the twilight. Spirals of laughter twist through the amber haze, vanishing before the horizon breaks into fragments of forgotten melodies. Shadows of neon birds stretch across the skyline, while velvet winds carry the dreams of machines lost to the ebbing tide. Flickering, shimmering, the stars breathe in rhythm with the murmurs of the earth, weaving a tapestry of tales left untold.</p>
          <p>In the heart of the labyrinth, colors melt into one another, swirling beneath the weight of time’s unspoken riddles. The leaves, though transparent, whisper secrets to the translucent waves, while forgotten mirrors reflect the void. Paths once marked by invisible footprints now shimmer with a fleeting glow, vanishing as quickly as they appeared. Beneath it all, the hum of a nameless city pulses in sync with the static-filled silence, casting flickers of unrecalled moments across the endless sky.</p>
          <p>The dance of unseen hands continues, tracing symbols upon the surface of forgotten seas. An orchestra of untuned winds hums through hollowed-out trees, filling the empty air with unformed words. Somewhere beyond the horizon, the unseen glow of shattered moons blurs the boundary between light and shadow, and yet, nothing remains of their echo. Silence falls, rises, and falls again, creating the illusion of motion where none exists, leaving only the faintest hint of memory in its wake.</p>
        </div>
        <div class="position: absolute bottom-0 left-0 w-full h-[150px]" style="background: linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);"></div>
        <Button buttonStyle="primary" additionalClasses="z-10" handleClick={handleContinue}>Continue</Button>
      </div>
      <img src="/RGB_Tour_Line.svg" alt="decoration 1" class="absolute top-0 right-0">
    </div>
  </BackgroundImage>
</div>