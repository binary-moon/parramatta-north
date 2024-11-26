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
    <!-- <img src="/Footer_Logo.svg" alt="NSW Government - Property and Development NSW"/> -->
    <p class="text-white border-neutral-content border-opacity-25 mt-6">
      {#if theme === "parramatta-north"}
      Parramatta North. A place of connection and renewal – through reflection, discovery and opportunity. Here, a long-term vision is taking shape.
      {/if}
      {#if theme === "rgb"}
      Macquarie Street East. Where Sydney’s rich Aboriginal and modern histories come to life and arts and culture thrive. Be Educated. Be Entertained. Be Surprised.
      {/if}
    </p>
  </div>
</footer>