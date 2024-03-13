<script lang="ts">

  export let text: string;
  export let isActive: boolean = false;
  export let handleFilter: (option: string) => void;

  $: classes = `p-3 rounded-full text-sm font-bold border-[1px] border-neutral ${isActive ? 'bg-primary text-white border-primary' : ''}`
</script>
<button class={classes} on:click={() => handleFilter(text)}>{text}</button>