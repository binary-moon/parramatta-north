<script lang="ts">
  export let url: string;
  console.log({url})
</script>
<div class="h-full w-full bg-black fixed top-0 left-0">
  <iframe class="h-full w-full" src={url} frameborder="0" allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;" allowfullscreen/>
</div>