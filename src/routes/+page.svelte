<script>
  import { onMount } from 'svelte';

  import { isAcknowledgementVisible, hasAcknowledgementBeenSeen } from '$lib/store.ts';

  const theme = import.meta.env.VITE_THEME;

  let components = {};

  export let data;
  const { pageData } = data;

  // Dynamically import components based on the componentType
  onMount(async () => {
    const imports = pageData.map(item => {
      const componentType = item.componentType;
      return import(`$lib/${componentType}.svelte`)
        .then(comp => {
          components[componentType] = comp.default;
        });
    });
    await Promise.all(imports);
    console.log({pageData, components })

    // Check if acknowledgement has been seen and toggle visibility accordingly
    let hasBeenSeen;
    hasAcknowledgementBeenSeen.subscribe(value => hasBeenSeen = value);

    if (theme === 'rgb' && !hasBeenSeen) {
      // Wait for 5 seconds before showing the acknowledgement
      setTimeout(() => {
        isAcknowledgementVisible.set(true);
        hasAcknowledgementBeenSeen.set(true); // Set the flag so it won't show again
      }, 1000);
    }
  });
</script>

<!-- Render the dynamically imported components -->
{#each pageData as { componentType, props, raw }}
  {#if components[componentType] && raw && raw.length !== 0}
    <svelte:component this={components[componentType]} {...props} />
  {/if}
{/each}