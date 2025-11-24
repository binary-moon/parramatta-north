<script lang="ts">
  import { isTourShowGuide } from "$lib/store";
  import EmblaCarousel from "embla-carousel";
  import { onDestroy, onMount } from "svelte";
  import { quintOut } from "svelte/easing";
  import { scale } from "svelte/transition";
  import { addDotBtnsAndClickHandlers } from "./utilities/emblemDotHandler";

  let isFinalStep: number = 1;
  let tourEmbleSlider: any = null;
  let cleanup: (() => void) | null = null;
  let unsubscribe: (() => void) | null = null;

  function handleContinue() {
    isFinalStep++;
    if (isFinalStep > 4) {
      sessionStorage.setItem("isTourSeen", "true");
      isTourShowGuide.set(false);
    }
  }

  function onCloseModal() {
    sessionStorage.setItem("isTourSeen", "true");
    isTourShowGuide.set(false);
  }

  function initSlider() {
    destroySlider();
    isFinalStep = 1;
    const emblaNode = document.querySelector(".embla-tour") as HTMLElement;
    if (emblaNode) {
      const viewportNode = emblaNode.querySelector(
        ".embla__viewport"
      ) as HTMLElement;
      const nextBtnNode = emblaNode.querySelector(
        ".embla__button--next"
      ) as HTMLElement;
      const dotsNode = emblaNode.querySelector(".embla__dots") as HTMLElement;
      const OPTIONS = { loop: true, duration: 30 };

      tourEmbleSlider = EmblaCarousel(viewportNode, OPTIONS);
      tourEmbleSlider.scrollTo(0);

      tourEmbleSlider.on("select", () => {
        const currentIndex = tourEmbleSlider.selectedScrollSnap();
        isFinalStep = currentIndex + 1;
      });

      const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
        tourEmbleSlider,
        dotsNode
      );
      tourEmbleSlider.on("destroy", removeDotBtnsAndClickHandlers);

      const scrollNext = () => tourEmbleSlider.scrollNext();
      nextBtnNode.addEventListener("click", scrollNext, false);

      cleanup = () => {
        nextBtnNode.removeEventListener("click", scrollNext, false);
        tourEmbleSlider && tourEmbleSlider.destroy();
        tourEmbleSlider = null;
      };
    }
  }

  function destroySlider() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    tourEmbleSlider = null;
  }

  onMount(() => {
    unsubscribe = isTourShowGuide.subscribe((value) => {
      if (value) {
        setTimeout(() => {
          initSlider();
        }, 0);
      } else {
        destroySlider();
      }
    });
    if ($isTourShowGuide) {
      setTimeout(() => {
        initSlider();
      }, 0);
    }
    return () => {
      destroySlider();
      unsubscribe && unsubscribe();
    };
  });

  onDestroy(() => {
    destroySlider();
    unsubscribe && unsubscribe();
  });
</script>

{#if $isTourShowGuide}
  <div
    class="flex w-full h-full absolute top-0 left-0 z-[99]"
    transition:scale={{
      duration: 600,
      opacity: 0,
      start: 0.8,
      easing: quintOut,
    }}
  >
    <div class="relative p-6 w-full flex items-center justify-center">
      <div class="absolute w-full h-full bg-gray-800 opacity-80"></div>

      <div class="relative w-full bg-white rounded-xl p-6">
        <div class="flex justify-end">
          <button
            on:click={onCloseModal}
            class="text-gray-500 font-extralight text-[50px] leading-[30px]"
          >
            &times;
          </button>
        </div>

        <div class="mt-4">
          <h1 class="text-2xl font-bold text-center mb-6">Navigating Places</h1>
          <div class="embla-tour">
            <div class="embla__viewport">
              <div class="embla__container">
                <div class="embla__slide min-h-[229px]">
                  <img
                    class="object-contain"
                    src="/onboarding-slide1.png"
                    alt="this is associated to first time tour guide"
                  />
                  <p class="text-xl mt-4">
                    The blue dot marks your current location and direction on
                    the map
                  </p>
                </div>
                <div class="embla__slide min-h-[229px]">
                  <img
                    class="object-contain"
                    src="/onboarding-slide2.png"
                    alt="this is associated to first time tour guide"
                  />
                  <p class="text-xl mt-4">
                    Tap any of the numbered dots to change your next Place
                  </p>
                </div>
                <div class="embla__slide min-h-[229px]">
                  <img
                    class="object-contain"
                    src="/onboarding-slide3.png"
                    alt="this is associated to first time tour guide"
                  />
                  <p class="text-xl mt-4">
                    The Place details pop up once you've arrived
                  </p>
                </div>
                <div class="embla__slide min-h-[229px]">
                  <img
                    class="object-contain"
                    src="/onboarding-slide4.png"
                    alt="this is associated to first time tour guide"
                  />
                  <p class="text-xl mt-4">
                    Tap the <span class="font-bold">Travel to...</span> button to
                    navigate to the next Place
                  </p>
                </div>
              </div>
            </div>

            <div class="embla__controls mt-4 flex flex-col items-center">
              <div class="embla__dots mb-4"></div>
              <div class="embla__buttons w-full">
                <button
                  on:click={handleContinue}
                  class="embla__button embla__button--next bg-orange-500 text-white font-bold min-w-[150px] p-2 rounded-xl"
                  type="button"
                >
                  {isFinalStep === 4 ? "Ok got it!" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .embla-tour {
    overflow: hidden;
    --slide-spacing: 1rem;
  }
  .embla__container {
    display: flex;
    margin-left: calc(var(--slide-spacing) * -1);
  }
  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
    padding-left: var(--slide-spacing);
  }

  .embla__button {
    width: 100%;
  }

  .embla__dots {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.embla__dot) {
    -webkit-tap-highlight-color: rgba(var(--text-high-contrast-rgb-value), 0.5);
    -webkit-appearance: none;
    appearance: none;
    background-color: black;
    touch-action: manipulation;
    display: inline-flex;
    text-decoration: none;
    cursor: pointer;
    border: 0;
    padding: 0;
    margin: 0;
    width: 0.5rem;
    height: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  :global(.embla__dot--selected) {
    background-color: orange;
  }
  :global(.embla__slide__img) {
    user-select: none;
  }
</style>
