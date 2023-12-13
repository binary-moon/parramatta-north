<script lang="ts">
  import { targetLocation, setTargetLocation } from '$lib/store'

  interface Location {
    lat: number;
    lng: number;
  }

  const emreLocation: Location = { lat: -33.74020, lng: 151.04561 };
  const denizLocation: Location = { lat: -34.03747, lng: 151.08472 };
</script>

<div class="fixed top-0 left-0 m-4 p-4">
  <button class="btn {$targetLocation === emreLocation ? 'btn-primary' : 'btn-neutral'}" on:click={() => setTargetLocation(emreLocation)}>Emre</button>
  <button class="btn {$targetLocation === denizLocation ? 'btn-primary' : 'btn-neutral'}" on:click={() => setTargetLocation(denizLocation)}>Deniz</button>
</div>