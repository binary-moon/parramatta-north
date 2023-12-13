<script>
  import GoogleMaps from '../lib/Map.svelte';
  import { onMount, onDestroy } from "svelte";

  let lat = -33.73994;
  let lng = 151.04781;
  let targetLocation = { lat, lng };

</script>

<GoogleMaps {targetLocation} />