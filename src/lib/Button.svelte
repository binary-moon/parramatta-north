<script lang="ts">
  export let buttonStyle: string = 'neutral';
  export let isOutline: boolean = false;
  export let handleClick: (event?: MouseEvent) => void = () => {};
  export let type: "button" | "reset" | "submit" = 'button';
  export let additionalClasses: string = '';

  // Function to construct class names
  function constructClassNames() {
    let baseClasses = 'btn rounded-full text-lg font-bold normal-case';
    let styleClasses = `btn-${buttonStyle} ${buttonStyle === 'ghost' || isOutline ? 'text-neutral' : 'text-white'}`;
    let outlineClass = isOutline ? 'btn-outline border-[2px]' : '';
    
    return `${baseClasses} ${styleClasses} ${outlineClass} ${additionalClasses}`.trim();
  }

  // Reactive statement to update class names
  $: classes = constructClassNames();
</script>
<button type={type} class={classes} on:click={handleClick}><slot></slot></button>