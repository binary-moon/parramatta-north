<script lang="ts">
  export let icon: string;
  export let title: string;
  export let description: string;
  export let linkText: string;
  export let href: string;
</script>
<a href={href}>
  <div class="flex flex-col gap-6 py-6 border-b-neutral-content border-b-[1px] border-solid">
    <div class="flex gap-5 justify-between items-start">
      <img src={icon} alt={title} class="block"/>
      <div class="flex flex-col gap-3">
        <span class="text-[22px]/[28px] font-bold">{title}</span>
        <span class="text-base">{description}</span>
        <span class="flex gap-[6px]">
          <span class="text-base text-primary underline font-bold underline">{linkText}</span>
          <img src="/Primary_Arrow.svg" alt={linkText} /> 
        </span>
      </div>
    </div>
  </div>
</a>