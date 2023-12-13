<script>
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  export let visible = false;
</script>

{#if visible}
  <div 
    class="fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg"
    transition:slide={{ delay: 0, duration: 500, easing: cubicOut }}>
    You are within 50 meters of the target location.
  </div>
{/if}