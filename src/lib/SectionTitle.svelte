<script lang="ts">

  export let title: string;
  export let moreLink: string;
</script>
<div class="px-6 flex justify-between">
  <h2 class="text-[32px]/[32px] text-primary font-semibold">{title}</h2>
  {#if moreLink}
    <a href={moreLink} class="flex text-lg gap-2 font-semibold">more <img src="/Arrow.svg" class="w-6" alt="more"/></a>
  {/if}
</div>
