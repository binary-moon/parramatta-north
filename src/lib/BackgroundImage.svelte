<script lang="ts">
  import { onMount } from 'svelte';

  import { fetchImage } from './utilities/fetchMedia';

  export let classes = '';
  export let imageId: number;
  export let placeholderImage: string | null = '';
  export let imageSize: string = 'full';

  let backgroundStyle = `background-image: url(${placeholderImage});`

  const loadImage = async () => {
    const image = await fetchImage(imageId, imageSize);
    backgroundStyle = `background-image: url(${image});`
  }

  onMount(() => {
    loadImage();
  })
</script>
<div style={backgroundStyle} class="bg-cover bg-center {classes}">
  <slot></slot>
</div>