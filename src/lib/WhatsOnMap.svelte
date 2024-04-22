<script lang="ts">
  import { onMount } from "svelte";

  import EventPlaceDetails from "./EventPlaceDetails.svelte";

  import { loadScript } from '$lib/utilities/loadScript';

  export let places = [];

  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let map: google.maps.Map;
  let directionsService: google.maps.DirectionsService;
  let userPathDirectionsRenderer: google.maps.DirectionsRenderer;
  let UserMarker: any;
  let userMarker: any | null = null;
  let PlaceMarker: any;
  let placeMarkers: any[] = [];
  let userLocation: google.maps.LatLng | null = null;
  let deviceOrientation: DeviceOrientationEvent | null = null;
  let activePlace: number = 0;
  let watchId: number | null;
  const mapImagePlaceholder = 'https://placehold.co/255x255/black/333';

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    deviceOrientation = event;

    if (deviceOrientation && userMarker) {
      const { alpha } = deviceOrientation;
      userMarker.updateRotation(alpha);
    }
  };

  const requestDeviceOrientationPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
        }
      } catch (error) {
        console.error('Error requesting Device Orientation permission:', error);
      }
    } else {
      // Handle browsers that don't support permission request
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
  };

  const sortTourStepsByUserLocation = (userLocation: google.maps.LatLng) => {
    places.sort((a, b) => {
      const distanceA = google.maps.geometry.spherical.computeDistanceBetween(
        userLocation,
        new google.maps.LatLng(a.location.lat, a.location.lng)
      );
      const distanceB = google.maps.geometry.spherical.computeDistanceBetween(
        userLocation,
        new google.maps.LatLng(b.location.lat, b.location.lng)
      );
      return distanceA - distanceB;
    });
  };

  const drawPathToActiveMarker = (userLocation: google.maps.LatLng) => {
    const activeMarker = placeMarkers[activePlace];
    if (activeMarker) {
      const activeMarkerLocation = activeMarker.getPosition();
      if (activeMarkerLocation) {
        directionsService.route(
          {
            origin: userLocation,
            destination: activeMarkerLocation,
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
    }
  }

  const drawUserMarkerAndUpdateLocation = () => {
    watchId = navigator.geolocation.watchPosition((position) => {
      userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      if (!userMarker) {
        userMarker = new UserMarker(userLocation, map);
      } else {
        userMarker.updatePosition(userLocation);
      }

      drawPathToActiveMarker(userLocation)
    }, null, { enableHighAccuracy: true });
  }

  const handleMarkerClick = (marker) => {
    activePlace = marker.index;
    placeMarkers.forEach(marker => marker.makeInactive());
    marker.makeActive();
  }

  const loadMarkersAndDrawRoute = (map: google.maps.Map) => {
    places.forEach((place, index) => {
      const placeMarker = new PlaceMarker(place.location, map, place.mapImage || mapImagePlaceholder, index === 0 ? true : false, handleMarkerClick, index);
      placeMarkers.push(placeMarker); // Store marker for later use
    });

    if (navigator.geolocation) {
      drawUserMarkerAndUpdateLocation();
    }
  }

  $: {
    if (userMarker && typeof userMarker.getPosition === 'function' && activePlace > -1) {
      const userLocation = userMarker.getPosition();
      drawPathToActiveMarker(userLocation);
    }
  }

  $: {
    if (userLocation && activePlace > -1) {
      drawPathToActiveMarker(userLocation);
    }
  }

  const clearComponent = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    if (userMarker) {
      userMarker.onRemove();
      userMarker = null;
    }
    if (placeMarkers.length > 0) {
      placeMarkers.forEach(marker => marker.onRemove());
      placeMarkers = [];
    }
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }
  };

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, async () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: places[0].location,
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
                scale: 3,
              },
              offset: "0",
              repeat: "16px",
            },
          ],
        },
        suppressMarkers: true,
        preserveViewport: true,
      });
      userPathDirectionsRenderer.setMap(map);

      const module = await import('$lib/classes/UserMarker');
      UserMarker = module.UserMarker;

      const placeMarkerModule = await import('$lib/classes/PlaceMarker');
      PlaceMarker = placeMarkerModule.PlaceMarker;

      if (window.DeviceOrientationEvent) {
        requestDeviceOrientationPermission();
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          sortTourStepsByUserLocation(userLocation); // Sort tour steps based on user location
          loadMarkersAndDrawRoute(map);
          drawUserMarkerAndUpdateLocation();
        }, null, { enableHighAccuracy: true });
      } else {
        loadMarkersAndDrawRoute(map);
      }
    });

    return () => {
      clearComponent();
    }
  });
</script>
<div id="map" class="h-full w-full"></div>
<EventPlaceDetails {places} {activePlace} />