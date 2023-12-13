<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import UserLocation from './UserLocation.svelte';

  let map: google.maps.Map;;
  export let targetLocation;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  let userMarker;
  let watchId;
  let userIsNearTarget = false;

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // metres
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lng2 - lng1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: targetLocation,
        zoom: 14,
      });

      new google.maps.Marker({
        position: targetLocation,
        map,
      });

      if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        let userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        let distance = calculateDistance(targetLocation.lat, targetLocation.lng, userLocation.lat, userLocation.lng);

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
<UserLocation visible={userIsNearTarget} />