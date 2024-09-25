<script>
  import { page } from '$app/stores';
  import "../app.css";
  import Header from '../lib/Header.svelte';
  import Footer from '../lib/Footer.svelte';
  import QuickFind from "../lib/QuickFind.svelte";
  import Acknowledgement from '$lib/Acknowledgement.svelte';

  import { isAcknowledgementVisible, isNavActive } from '$lib/store';

  console.log('Development build');

  // Get the theme data from the page store
  $: {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute('data-theme', $page.data.theme);
    }
  }

  $: isHomePage = $page.route.id === '/' && !$isAcknowledgementVisible;
  $: isWhiteLogo = !!$page.data.isWhiteLogo || $isAcknowledgementVisible;

  // Reactively watch isAcknowledgementVisible and update the body overflow
  $: {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = $isAcknowledgementVisible || $isNavActive ? 'hidden' : '';
    }
  }
</script>

<div class="text-neutral">
  <Header isHomePage={isHomePage} isWhiteLogo={isWhiteLogo}/>
  <slot />
  {#if !$page.data.isFooterHidden}
    {#if !$page.data.theme === Boolean('rgb')}
      <QuickFind />
    {/if}
    <Footer />
  {/if}
  {#if $page.data.theme === 'rgb' && $isAcknowledgementVisible}
    <Acknowledgement />
  {/if}
</div>