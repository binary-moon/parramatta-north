<script lang="ts">
  import TourStepDetail from "./TourStepDetail.svelte";
  import { areTourDetailsExpanded } from "./store";
  
  import type { ITourStep } from './types';

  export let tourSteps: ITourStep[] = [];
  export let title: string;
  export let activeStep: number = 1;
  export let hasActiveStepReached: boolean;

  $: translateYValue = $areTourDetailsExpanded ? '0' : '75%';
  $: translateXValue = `calc(-${(activeStep - 1) * 100}% - ${(activeStep - 1) * 6}px)`;
  $: transformValue = `translate3d(${translateXValue}, ${translateYValue}, 0)`;
  $: width = 'calc(100% - 1.5rem)';
  $: height = 'calc(100% - 3rem)';
  $: styles = `transform: ${transformValue}; width: ${width}; height: ${height};`;
</script>
<div class="absolute top-12 left-3 transition-transform duration-300 ease-in-out" style={styles}>
  <div class="flex h-full gap-[6px] snap-x snap-mandatory" >
    {#each tourSteps as tourStep, index}
      <div class="flex-none w-full h-full snap-start relative">
        <TourStepDetail details={tourStep} {title} {index} isArrived={index + 1 === activeStep && hasActiveStepReached}/>
      </div>
    {/each}
  </div>
</div>