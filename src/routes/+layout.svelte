<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import "../app.css";
  import Header from '../lib/Header.svelte';
  import Footer from '../lib/Footer.svelte';
  import QuickFind from "../lib/QuickFind.svelte";
  import Acknowledgement from '$lib/Acknowledgement.svelte';
  import { isAcknowledgementVisible, isNavActive } from '$lib/store';

  const gaID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  onMount(() => {
    // Inject the GA scripts into the head
    const gtagScript = document.createElement('script');
    gtagScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${gaID}`);
    gtagScript.setAttribute('async', '');
    document.head.appendChild(gtagScript);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaID}');
    `;
    document.head.appendChild(inlineScript);
  });

  // Rest of your reactive declarations and logic
  $: {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute('data-theme', $page.data.theme);
    }
  }

  $: isHomePage = $page.route.id === '/' && !$isAcknowledgementVisible;
  $: isWhiteLogo = !!$page.data.isWhiteLogo || $isAcknowledgementVisible;

  $: {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = $isAcknowledgementVisible || $isNavActive ? 'hidden' : '';
    }
  }
</script>

<!-- Remove GA scripts from svelte:head -->
<svelte:head>
  <!-- Other head elements if any -->
</svelte:head>

<div class="text-neutral">
  <Header isHomePage={isHomePage} isWhiteLogo={isWhiteLogo}/>
  <slot />
  {#if !$page.data.isFooterHidden}
    {#if !$page.data.theme === Boolean('rgb')}
      <QuickFind />
    {/if}
    <Footer />
  {/if}
  {#if $isAcknowledgementVisible}
    <Acknowledgement />
  {/if}
</div>
