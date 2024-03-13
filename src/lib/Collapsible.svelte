<script lang="ts">

  export let title: string;
  export let content: string;
</script>
<button tabindex="0" class="collapse collapse-plus text-left pb-12 border-b-[1px] border-neutral rounded-none">
  <div class="collapse-title text-lg font-bold pl-0 pr-12 pt-0 pb-0 after:text-primary after:text-3xl after:!top-0 after:font-normal">
    {title}
  </div>
  <div class="collapse-content px-0 pb-0 pt-0"> 
    <p class="text-base/[22px]">{content}</p>
  </div>
</button>