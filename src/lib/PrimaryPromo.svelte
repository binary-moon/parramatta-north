<script lang="ts">
  import Card from "./Card.svelte";

  const theme = import.meta.env.VITE_THEME;

  export let tags: string[];
  export let title: string;
  export let subtitle: string;
  export let image: string;
  export let href: string = "/";
</script>
<div class="px-6 relative pb-12 pt-32 -mt-32">
  <Card {tags} {title} {subtitle} {image} {href} isLargeTitle />
  {#if theme === "parramatta-north"}
  <img src="/Promo_Deco_1.svg" alt="Promo decoration" class="absolute top-0 right-0">
  <img src="/Promo_Deco_2.svg" alt="Promo decoration" class="absolute bottom-0 left-0">
  {:else if theme === "rgb"}
  <img src="/RGB_Line_Homepage.svg" alt="Promo decoration" class="absolute top-0 right-0">
  {/if}
</div>