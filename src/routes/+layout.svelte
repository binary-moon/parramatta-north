<script>
  import { page } from '$app/stores';

  import "../app.css";

  import Header from '../lib/Header.svelte';
  import Footer from '../lib/Footer.svelte';
  import QuickFind from "../lib/QuickFind.svelte";
  console.log($page)
</script>

<div class="text-neutral">
  <Header isHomePage={$page.route.id === '/'} isWhiteLogo={!!$page.data.isWhiteLogo}/>
  <slot />
  {#if !$page.data.isFooterHidden}
    <QuickFind />
    <Footer />
  {/if}
</div>