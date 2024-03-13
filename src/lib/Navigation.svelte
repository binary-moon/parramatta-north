<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { isNavActive} from '$lib/store';

  const data = 
  {
    primary: [
      {
        title: 'Home',
        url: '/'
      },
      {
        title: 'Tours',
        url: '/tours',
      },
      {
        title: 'Places',
        url: '/places',
      },
      {
        title: 'What\'s on',
        url: '/whats-on',
      },
      {
        title: 'Latest news',
        url: '/latest-news',
      },
      {
        title: 'Getting here',
        url: '/getting-here',
      }
    ],
    secondary: [
      {
        title: 'Subscribe',
        url: '/subscribe',
      },
      {
        title: 'FAQs',
        url: '/faqs', 
      },
      {
        title: 'Privacy policy',
        url: '/privacy-policy',
      }
    ]
  }

  const handleClick = () => {
    isNavActive.set(false);
  }
  
</script>

{#if $isNavActive}
  <nav 
    class="bg-primary absolute top-0 left-0 w-full h-full py-16 px-6 z-20"
    transition:fly={{ delay: 0, duration: 300, easing: cubicOut }}
  >
    <img src="/Logo_Parramatta_North_On_Colour.svg" alt="Paramatta North">
    <ul class="flex flex-col gap-4 mt-20">
      {#each data.primary as { title, url }, i}
        <li>
          <a  href={url} class="text-white text-3xl" on:click={handleClick}>{title}</a>
        </li>
      {/each}
    </ul>
    <ul class="flex flex-col gap-4 mt-16">
      {#each data.secondary as { title, url }, i}
        <li>
          <a  href={url} class="text-white text-lg" on:click={handleClick}>{title}</a>
        </li>
      {/each}
    </ul>
    <img src="/Top_Line.svg" alt="decoration 1" class="absolute top-[143px] right-0">
    <img src="/Bottom_Line.svg" alt="decoration 2" class="absolute bottom-0">
  </nav>
{/if}