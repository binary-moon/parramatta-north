<script lang="ts">

  export let icon: string;
  export let title: string;
  export let href: string;
</script>
<a href={href} class="w-full h-full bg-white rounded-[30px] py-[18px] px-[30px]">
  <div class="flex flex-col items-center gap-4">
    <img src={icon} alt={title} class="w-15 h-15"/>
    <p class="text-sm/[14px] font-bold text-center">{title}</p>
  </div>
</a>