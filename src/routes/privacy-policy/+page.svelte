<script lang="ts">
    import { onMount } from 'svelte';
    import data from './data.json';

		import Prose from '$lib/Prose.svelte';

		let contentHTML: string = '';

		const theme = import.meta.env.VITE_THEME;
		
		onMount(async () => {
			contentHTML = data.html;
		});
</script>
<div class="flex flex-col pt-16 pb-6 -mt-8 relative px-6 gap-8">
  <h2 class="text-3xl text-primary font-bold">Privacy Policy</h2>
	<Prose>{@html contentHTML}</Prose>
	{#if theme === 'northParramatta'}
         <img src="/Whats_On_Deco.svg" alt="Promo decoration" class="absolute top-0 right-0">
        {/if}
        {#if theme === 'rgb'}
         <img src="/RGB_News_Line.svg" alt="Promo decoration" class="absolute top-0 right-0">
        {/if}
</div>