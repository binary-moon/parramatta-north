<script lang="ts">
  export let text: string;
  export let type: string = "primary";

  $: classes = `bg-${type} ${type !== 'white' ? 'text-white' : 'text-neutral'} rounded-full text-sm/[14px] font-bold px-3 py-[6px]`;
</script>

<span class={classes}>{text}</span>