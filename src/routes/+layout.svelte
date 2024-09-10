<script>
  import { page } from '$app/stores';
  import "../app.css";
  import Header from '../lib/Header.svelte';
  import Footer from '../lib/Footer.svelte';
  import QuickFind from "../lib/QuickFind.svelte";

  console.log('Development build');

  // Get the theme data from the page store
  $: {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute('data-theme', $page.data.theme);
    }
  }
</script>

<div class="text-neutral">
  <Header isHomePage={$page.route.id === '/'} isWhiteLogo={!!$page.data.isWhiteLogo}/>
  <slot />
  {#if !$page.data.isFooterHidden}
    {#if !$page.data.theme === 'rgb'}
      <QuickFind />
    {/if}
    <Footer />
  {/if}
</div>