<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchImage } from './utilities/fetchMedia';

  export let classes = ''
  export let imageId: number;
  export let placeholderImage: string | null = '';
  export let alt: string = 'Image';
  export let imageSize: string = 'full';

  let imageUrl = placeholderImage

  const loadImage = async () => {
    const image = await fetchImage(imageId, imageSize);
    imageUrl = image || placeholderImage;
  }

  onMount(() => {
    loadImage();
  })
</script>
<img src={imageUrl} class={classes} alt={alt}/>