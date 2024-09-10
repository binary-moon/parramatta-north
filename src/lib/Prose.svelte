<script lang="ts">
  const theme = import.meta.env.VITE_THEME;

  const themeClass = theme === 'parramatta-north' ? 'prose prose-parramatta-north' : 'prose prose-rgb';
</script>

<div class={`prose ${themeClass}`}>
  <slot></slot>
</div>