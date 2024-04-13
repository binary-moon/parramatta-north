<script>
  import { onMount } from 'svelte';

  let components = {};

  export let data;
  const { pageData } = data;

  console.log(pageData)

  // Dynamically import components based on the componentType
  onMount(async () => {
    const imports = pageData.map(item => {
      console.log(item)
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
{#each pageData as { componentType, props }}
  {#if components[componentType]}
    <svelte:component this={components[componentType]} {...props} />
  {/if}
{/each}