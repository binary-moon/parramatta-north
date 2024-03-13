<script lang="ts">
  export let isNavActive = false
  export let toggleNavigation = () => {}
</script>
<button on:click={toggleNavigation} class="z-30">
  {#if isNavActive}
    <img src="/Global_Nav_Burger_Close.svg" alt="Close navigation button">
  {:else}
    <img src="/Global_Nav_Burger.svg" alt="Navigation button">
  {/if}
</button>