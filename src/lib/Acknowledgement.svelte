<script lang="ts">
  import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  import BackgroundImage from '$lib/BackgroundImage.svelte';
  import Button from './Button.svelte';

  import { isAcknowledgementVisible } from './store';

  const theme = import.meta.env.VITE_THEME;

  let imageLoaded = false; // Track image loading status
  const detailImagePlaceholder = 'https://placehold.co/2000x2000/black/333'
  const backgroundImage = theme === 'rgb' ?  '/AoC_Image.png' : '/AoC_Parramatta.png';

  const audioUrl = null;

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    console.log('Audio Click');
  }

  const handleContinue = () => {
    isAcknowledgementVisible.set(false);
  }

  // Trigger the display of modal only after the image is loaded
  function handleImageLoad() {
    imageLoaded = true;
  }
</script>
{#if imageLoaded}
<div class="flex w-full h-full absolute top-0 left-0 text-white" transition:scale={{ duration: 600, opacity: 0, start: 0.8, easing: quintOut}}>
  <BackgroundImage
    classes="flex w-full h-full absolute top-0 left-0 text-white"
    hardcodedImage={backgroundImage}
    placeholderImage={detailImagePlaceholder}
  >
    <div class="flex w-full h-full absolute top-0 left-0 bg-black bg-opacity-60">
      <div class="flex flex-col p-6 pt-48 gap-6">
        {#if audioUrl}
        <button on:click={handleAudioClick} class="flex gap-2 items-center text-sm font-bold underline">
          <img src="/Audio_Description_ Icon.svg" alt="Audio"/> Listen to audio description
        </button>
        {/if}
        
        <div class="relative flex flex-col gap-6 overflow-y-scroll pb-12">
          {#if theme === 'rgb'}
          <p>The Macquarie Street East precinct is on Gadigal Land. We recognise that despite being changed with concrete, steel and bitumen, this Country is still cared for by the Gadigal people and their Ancestors continue to walk this land. We express our gratitude to Elders and Knowledge Holders whose wisdom, activism and knowledges have kept culture alive in this place.</p>
          <p>We recognise our responsibility as the current caretakers of the Macquarie Street East Precinct to respect both this Country and those who belong to this Country. We strive to create spaces in the Macquarie Street East Precinct that are welcoming and safe for all, especially First Nations peoples whose cultures are valued as being deeply integral to this place.</p>
          {/if}
          {#if theme === 'parramatta-north'}
          <p>Parramatta North is located on the lands of the Burramada people of the Dharug Nation. We pay our deepest respects to their culture, stories and custodianship of land and waters across the Parramatta North precinct and extend that respect to other Dharug people with strong cultural connections to this Country. We also recognise and celebrate the new and enduring connections of all other Aboriginal and Torres Strait Islander peoples to this important place.</p>
          <p>We acknowledge the Traditional Custodians and knowledge holders of Country, pay respect to Ancestors and Elders whilst recognising ongoing connections to Country and culture. We seek to build ongoing relationships and collaborations in the celebration of culture, and revitalisation of natural systems throughout the regeneration of this place.</p>
          <p>Our collaborative approaches demonstrate our ongoing commitment to providing places in which Aboriginal people are included socially, culturally, spiritually and economically and the health of Country is prioritised. Our recognition of Aboriginal sovereignty is expressed with deep reverence, respect and commitment to Aboriginal protocols as we strive to move forward together into a better future.</p>
          {/if}
        </div>
        <div class="position: absolute bottom-0 left-0 w-full h-[150px]" style="background: linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%);"></div>
        <Button buttonStyle="primary" additionalClasses="z-10" handleClick={handleContinue}>Continue</Button>
      </div>
      <img src="/RGB_Tour_Line.svg" alt="decoration 1" class="absolute top-0 right-0">
    </div>
  </BackgroundImage>
</div>
{/if}
{#if theme === 'rgb'}
<img 
  src="/AoC_Image.png" 
  alt="Hidden AoC Image" 
  on:load={handleImageLoad} 
  class="hidden" 
/>
{/if}
{#if theme === 'parramatta-north'}
<img 
  src="/AoC_Parramatta.png" 
  alt="Hidden AoC Image" 
  on:load={handleImageLoad} 
  class="hidden" 
/>
{/if}