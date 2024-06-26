<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import UserLocation from './UserLocation.svelte';
  import Users from './Users.svelte';

  import { targetLocation } from '$lib/store';

  import { calculateDistance } from '$lib/utilities/calculations';

  let map: google.maps.Map;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let targetMarker: google.maps.Marker;
  let userMarker: google.maps.Marker;
  let watchId: number;
  let userIsNearTarget = false;
  let distance: number;

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: $targetLocation,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      targetMarker = new google.maps.Marker({
        position: $targetLocation,
        map,
      });

      if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        let userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        distance = calculateDistance($targetLocation.lat, $targetLocation.lng, userLocation.lat, userLocation.lng);

        // Remove the previous user marker, if it exists
        if (userMarker) {
          userMarker.setMap(null);
        }

        // Create a new marker at the user's location
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#0000FF",
            fillOpacity: 1,
            strokeWeight: 0
          }
        });

        if (distance <= 50) {
          console.log('you are within 50 meters of the location')
          userIsNearTarget = true;
        } else {
          console.log('you are away from the location')
          userIsNearTarget = false;
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    });
  })

  $: if (targetMarker && map) {
    targetMarker.setMap(null); // remove the old marker
    targetMarker = new google.maps.Marker({ // create a new marker
      position: $targetLocation,
      map,
    });
    map.setCenter($targetLocation); // center the map on the new location
  }

  onDestroy(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  function loadScript(url: string, callback: () => void): void {
    let script = document.createElement('script');
    script.type = 'text/javascript';

    script.onload = function() {
      callback();
    };

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
</script>

<div id="map" class="h-screen w-screen"></div>
<Users />
<UserLocation visible={userIsNearTarget} />
<div class="fixed top-0 right-0 m-8 p-4 bg-white leading-4">{Math.floor(distance)} meters</div>