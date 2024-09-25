<script lang="ts">
  import { onMount } from 'svelte';

  import { fetchImage } from './utilities/fetchMedia';

  export let classes = '';
  export let imageId: number | null = null;
  export let placeholderImage: string | null = '';
  export let imageSize: string = 'full';
  export let hardcodedImage: string | null = null;

  let backgroundStyle = `background-image: url(${placeholderImage});`

  const loadImage = async () => {
    if (!imageId) return;
    const image = await fetchImage(imageId, imageSize);
    backgroundStyle = `background-image: url(${image});`
  }

  onMount(() => {
    if (hardcodedImage) {
      backgroundStyle = `background-image: url(${hardcodedImage});`
      return;
    }
    loadImage();
  })
</script>
<div style={backgroundStyle} class="bg-cover bg-center {classes}">
  <slot></slot>
</div>