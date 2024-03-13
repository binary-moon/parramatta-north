<script>
  import { onMount } from 'svelte';
  import data from './data.json';

  let components = {};

  // Dynamically import components based on the componentType
  onMount(async () => {
    const imports = data.map(item => {
      const componentType = item.componentType;
      return import(`$lib/${componentType}.svelte`)
        .then(comp => {
          components[componentType] = comp.default;
        });
    });
    await Promise.all(imports);
  });
</script>

<!-- Render the dynamically imported components -->
{#each data as { componentType, props }}
  {#if components[componentType]}
    <svelte:component this={components[componentType]} {...props} />
  {/if}
{/each}