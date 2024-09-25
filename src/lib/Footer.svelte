<script lang="ts">
  const theme = import.meta.env.VITE_THEME;
  let title = "";
  if (theme === "parramatta-north") {
    title = "Parramatta North";
  } else if (theme === "rgb") {
    title = "Registrar General's Building";
  }
</script>

<footer>
  <div class="bg-primary px-6 py-3">
    <span class="text-white text-[27px]/[38px]">{title}</span>
  </div>
  <div class="bg-accent p-6 pb-12">
    <img src="/Footer_Logo.svg" alt="NSW Government - Property and Development NSW"/>
    <p class="text-white border-t-[1px] border-neutral-content border-opacity-25 mt-6 pt-12">We pay respect to the Traditional Custodians and First Peoples of NSW, and acknowledge their continued connection to their country and culture.</p>
  </div>
</footer>