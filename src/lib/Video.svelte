<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchVideo } from './utilities/fetchMedia';

  export let videoId: number;
  export let classes = '';

  let video: any = null;

  const loadVideo = async () => {
    video = await fetchVideo(videoId);
    console.log({video})
  }

  onMount(() => {
    loadVideo();
  })
</script>
{#if video}
  <video controls preload="metadata" class={`${classes} w-full`}>
    <source src={`${video.source_url}#t=0.001`} type={video.mime_type} />
    Your browser does not support the video tag.
  </video>
{/if}
