<script lang="ts">
  import BackgroundImage from "./BackgroundImage.svelte";
  import Card from "./Card.svelte";

  const theme = import.meta.env.VITE_THEME;

  export let id: number;
  export let tags: string[];
  export let title: string;
  export let subtitle: string;
  export let image: string;
  export let href: string = "/";
</script>

<div class="px-6 relative pb-4 pt-24 -mt-32">
  <!-- WIP id 385-->
  {#if id !== 385}
    <Card {tags} {title} {subtitle} {image} {href} isLargeTitle />
  {/if}
  {#if theme === "parramatta-north"}
    <a href="/tours">
      <BackgroundImage
        classes="overflow-hidden rounded-[60px]"
        hardcodedImage="/hero_image.png"
      >
        <div
          class="relative w-full px-8 py-9 h-[300px] flex items-end"
          style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 69.12%);"
        >
          <div class="flex items-center justify-between gap-4 w-full">
            <div class="flex flex-col justify-center items-start gap-4">
              <h1 class={`text-white text-3xl font-bold`}>Take a tour</h1>
              <span class="text-white text-sm">
                Choose from our self-guided digital tours full of compelling
                stories and features!
              </span>
            </div>
            <img
              class="min-w-[28px]"
              src="/Primary_Arrow.svg"
              alt="Start tour"
            />
          </div>
        </div>
      </BackgroundImage>
    </a>
    <img
      src="/Promo_Deco_1.svg"
      alt="Promo decoration"
      class="absolute top-0 right-0"
    />
    <img
      src="/Promo_Deco_2.svg"
      alt="Promo decoration"
      class="absolute bottom-0 left-0"
    />
  {:else if theme === "rgb"}
    <img
      src="/RGB_Line_Homepage.svg"
      alt="Promo decoration"
      class="absolute top-0 right-0"
    />
  {/if}
</div>
