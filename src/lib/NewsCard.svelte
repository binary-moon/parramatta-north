<script lang="ts">

  export let date: string;
  export let title: string;
  export let description: string;
  export let image: string;
  export let href: string;
</script>
<a href={href}>
  <div class="flex flex-col gap-6 py-6 border-b-neutral-content border-b-[1px] border-solid">
    <div class="flex gap-4 justify-between items-start">
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">{date}</span>
        <span class="text-[22px]/[28px] font-bold">{title}</span>
      </div>
      <img src={image} alt={title} class="w-[132px] rounded-[30px] block"/>
    </div>
    <span class="text-base">{description}</span>
  </div>
</a>