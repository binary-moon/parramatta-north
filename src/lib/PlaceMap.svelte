<script lang="ts">
  import type { ILatLong } from '$lib/types';
  import { onMount } from 'svelte';

  import { loadScript } from '$lib/utilities/loadScript';

  let map: google.maps.Map;
  let directionsService: google.maps.DirectionsService;
  let userPathDirectionsRenderer: google.maps.DirectionsRenderer;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let defaultLocation: ILatLong = { lat: -33.74069085195705, lng: 151.0442223807315 };
  let UserMarker: any;
  let userMarker: any | null = null;
  let PlaceMarker: any;
  let placeMarker: any | null = null;
  let deviceOrientation: DeviceOrientationEvent | null = null;
  let watchId: number | null;
  let distance: number | null = null;

  export let location: ILatLong = defaultLocation;
  export let title: string = '';
  export let image: string =  '';

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    deviceOrientation = event;

    if (userMarker && deviceOrientation) {
      const { alpha } = deviceOrientation;
      userMarker.updateRotation(alpha);
    }
  };

  const drawUserMarkerAndUpdateLocation = () => {
    watchId = navigator.geolocation.watchPosition((position) => {
      const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      distance = Math.floor(google.maps.geometry.spherical.computeDistanceBetween(userLocation, location));

      if (!userMarker) {
        userMarker = new UserMarker(userLocation, map);
      } else {
        userMarker.updatePosition(userLocation);
      }

      drawPathToPlaceMarker(userLocation)
    }, null, { enableHighAccuracy: true });
  }

  const drawPathToPlaceMarker = (userLocation: google.maps.LatLng) => {
    directionsService.route(
      {
        origin: userLocation,
        destination: location,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          userPathDirectionsRenderer.setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    )
  }

  const loadMarkersAndDrawRoute = (map: google.maps.Map) => {
    // Load markers and draw route

    placeMarker = new PlaceMarker(location, map, image);

    if (navigator.geolocation) {
      drawUserMarkerAndUpdateLocation();
    }
  };

  onMount(async () => {    
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: location,
      zoom: 17,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        }
      ]
    });

    const userMarkerModule = await import('$lib/classes/UserMarker');
    UserMarker = userMarkerModule.UserMarker;

    const placeMarkerModule = await import('$lib/classes/PlaceMarker');
    PlaceMarker = placeMarkerModule.PlaceMarker;

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    directionsService = new google.maps.DirectionsService();

    userPathDirectionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
        strokeColor: "#F3631B",
        strokeOpacity: 0,
        strokeWeight: 6,
        zIndex: 2,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillOpacity: 1,
              fillColor: "#F3631B",
              strokeOpacity: 1,
              strokeColor: "#F3631B",
              strokeWeight: 1,
              scale: 5,
            },
            offset: "0",
            repeat: "25px",
          },
        ],
      },
      suppressMarkers: true,
      });
      userPathDirectionsRenderer.setMap(map);

    loadMarkersAndDrawRoute(map)
  })
</script>

<div id="map" class="h-full w-full"></div>
<div class="absolute top-[120px] w-full px-6">
  <div class="bg-white rounded-[5px] px-3 py-5 shadow-md">
    <h1 class="text-[22px]/[28px] font-bold">{title}</h1>
    {#if distance}
      <span class="text-sm text-primary font-bold">{distance} metres away</span>
    {/if}
  </div>
</div>