<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchVideo } from './utilities/fetchMedia';

  export let videoId: number;
  export let classes = '';

  let video: any = null;
  let caption: string = '';

  const loadVideo = async () => {
    video = await fetchVideo(videoId);
    caption = stripHTML(video.caption.rendered);
    console.log({video})
  }

  const stripHTML = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  onMount(() => {
    loadVideo();
  })
</script>
{#if video}
  <video controls preload="metadata" class={`${classes} w-full`}>
    <source src={`${video.source_url}#t=0.001`} type={video.mime_type} />
    Your browser does not support the video tag.
  </video>
  <p class="text-xs text-center mt-3 px-4">{caption}</p>
{/if}
