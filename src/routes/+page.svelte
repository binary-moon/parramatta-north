<script>
  import { onMount } from 'svelte';

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
  });
</script>

<!-- Render the dynamically imported components -->
{#each pageData as { componentType, props, raw }}
  {#if components[componentType] && raw && raw.length !== 0}
    <svelte:component this={components[componentType]} {...props} />
  {/if}
{/each}