<script lang="ts">
  import NavigationButton  from "./NavigationButton.svelte";
  import Navigation  from "./Navigation.svelte";

  import { isNavActive, isPageScrolled } from '$lib/store';

  export let isHomePage = false;
  export let isWhiteLogo = false;

  const toggleNavigation = () => {
    isNavActive.set(!$isNavActive)
  }

  $: logoClasses = !isHomePage ? 'w-[143px]' : '';
  $: headerClasses= `flex flex-col justify-between py-16 px-6 gap-6 ${!isHomePage ? 'pb-8' : ''} ${$isPageScrolled ? 'opacity-0' : '' }`
</script>

<header class={headerClasses}>
  <div class="flex justify-between w-full items-start">
    <a href="/" class="z-20">
      {#if isWhiteLogo}
        <img src="/Logo_Parramatta_North_On_Colour.svg" alt="Parramatta North" class={logoClasses}>  
      {:else}
        <img src="/Logo_Parramatta_North_On_White.svg" alt="Parramatta North" class={logoClasses}>
      {/if}
    </a>
    <NavigationButton isNavActive={$isNavActive} toggleNavigation={toggleNavigation}/>
  </div>
  {#if isHomePage}
    <p>Explore and discover a new and emerging destination - a place of compelling stories, connecting Country and community.</p>
  {/if}
</header>
<Navigation isNavActive={$isNavActive} />