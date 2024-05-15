<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchVideo } from './utilities/fetchMedia';

  export let audioId: number;
  export let classes = '';

  let audio: any = null;
  let caption: string = '';

  const loadVideo = async () => {
    audio = await fetchVideo(audioId);
    caption = stripHTML(audio.caption.rendered);
    console.log({audio})
  }

  const stripHTML = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  onMount(() => {
    loadVideo();
  })
</script>
{#if audio}
  <audio controls class={`${classes} w-full`}>
    <source src={`${audio.source_url}#t=0.001`} type={audio.mime_type} />
    Your browser does not support the audio tag.
  </audio>
  <p class="text-xs text-center mt-3 px-4">{caption}</p>
{/if}
