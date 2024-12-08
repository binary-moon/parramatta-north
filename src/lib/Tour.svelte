<script lang="ts">
  import { onMount } from 'svelte';

  import TourSteps from '$lib/TourSteps.svelte';
  import ARFrame from '$lib/ARFrame.svelte';

  import { areTourDetailsExpanded, isTourStarted, isARActive, activeARURL } from '$lib/store';
  import { loadScript } from '$lib/utilities/loadScript';

  import type { ILatLong, ITourStep } from '$lib/types';

  const theme = import.meta.env.VITE_THEME;
  const brandColor = theme === 'rgb' ? '#146CFD' : '#F3631B';

  let map: google.maps.Map;
  let directionsService: google.maps.DirectionsService;
  let directionsRenderer: google.maps.DirectionsRenderer;
  let userPathDirectionsRenderer: google.maps.DirectionsRenderer;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let activeStep: number = 1;
  let watchId: number | null;
  let UserMarker: any;
  let userMarker: any | null = null;
  let hasActiveStepReached: boolean = false;
  let deviceOrientation: DeviceOrientationEvent | null = null;

  export let tourSteps: ITourStep[] = [];
  export let title: string = '';
  export let defaultLocation: ILatLong = { lat: -33.74069085195705, lng: 151.0442223807315 };

  let markers: google.maps.Marker[] = [];

  $: {
    markers.forEach((marker, index) => {
      setMarkerColor(marker, index); // Update marker color based on the current activeStep
    });
    if (userMarker && typeof userMarker.getPosition === 'function') {
      const userLocation = userMarker.getPosition();
      drawPathToActiveMarker(userLocation);
    }
  }

  const onMarkerClick = (marker: google.maps.Marker, index: number) => {
    // Update active step or any other callback action
    activeStep = index + 1;
    markers = markers.slice(); // Force reactivity
    hasActiveStepReached = false;
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    deviceOrientation = event;

    if (deviceOrientation && userMarker) {
      const { alpha } = deviceOrientation;
      userMarker.updateRotation(alpha);
    }
  };

  

  const drawUserMarkerAndUpdateLocation = () => {
    watchId = navigator.geolocation.watchPosition((position) => {
      const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      if (!userMarker) {
        userMarker = new UserMarker(userLocation, map);
      } else {
        userMarker.updatePosition(userLocation);
      }

      drawPathToActiveMarker(userLocation)
      checkDistanceToActiveMarker(userLocation);
    }, null, { enableHighAccuracy: true });
  }

  const drawPathToActiveMarker = (userLocation: google.maps.LatLng) => {
    const activeMarker = markers[activeStep - 1];
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

  const checkDistanceToActiveMarker = (userLocation: google.maps.LatLng) => {
    const activeMarker = markers[activeStep - 1];
    if (activeMarker) {
      const activeMarkerLocation = activeMarker.getPosition();
      if (!hasActiveStepReached && activeMarkerLocation) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, activeMarkerLocation);
        if (distance <= 25) {
          areTourDetailsExpanded.set(true);
          hasActiveStepReached = true;
        }
      }
    }
  }

  const setMarkerColor = (marker: google.maps.Marker, index: number) => {
    const isActive = activeStep === index + 1;
    const color = isActive ? brandColor : "#22272B"; // Active color or default color
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: 15,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0
    });
  }

  const loadMarkersAndDrawRoute = (map: google.maps.Map) => {
    tourSteps.forEach((step, index) => {
      let marker = new google.maps.Marker({
        position: step.location,
        map,
        title: `Step ${index + 1}`,
        label: {
          text: `${index + 1}`, // Label text
          color: "#FFFFFF", // Label text color, set this to your desired color
          fontSize: "14px", // Optional: You can set the font size
          fontWeight: "bold", // Optional: You can set the font weight
        },
      });

      setMarkerColor(marker, index); 

      marker.addListener('click', () => onMarkerClick(marker, index))
      markers.push(marker); // Store marker for later use
    });

    if (navigator.geolocation) {
      drawUserMarkerAndUpdateLocation();
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
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }

    window.removeEventListener('message', (event) => removeARFrame(event));

    areTourDetailsExpanded.set(false);
    isTourStarted.set(false);
  };

  const finishTour = () => {
    isTourStarted.set(false);
  }

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
    tourSteps.sort((a, b) => {
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

  const removeARFrame = (event) => {
    const eventData = event.data;
    if (eventData.action === 'exitAR') {
      isARActive.set(false);
    }
  }

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, async () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: defaultLocation,
        zoom: 18,
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
      directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#22272B", // Example: Red color for the route line
          strokeOpacity: 1,
          strokeWeight: 4,
          zIndex: 1,
        },
        suppressMarkers: true, // This will remove the default A, B, C markers
        preserveViewport: true,
      });
      directionsRenderer.setMap(map);

      userPathDirectionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
        strokeColor: brandColor,
        strokeOpacity: 0,
        strokeWeight: 6,
        zIndex: 2,
        icons: [
          {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillOpacity: 1,
              fillColor: brandColor,
              strokeOpacity: 1,
              strokeColor: brandColor,
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

      if (window.DeviceOrientationEvent) {
        // window.addEventListener('deviceorientation', handleDeviceOrientation);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
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

    window.addEventListener('message', (event) => removeARFrame(event));

    return () => {
      clearComponent();
    }
  })
</script>
<div id="map" class="h-full w-full"></div>
{#if !$areTourDetailsExpanded}
  <button class="absolute top-10 right-6" on:click={finishTour}><img src="/Close_Button.png" alt="Close button" /></button>
{/if}
<TourSteps {tourSteps} {title} {activeStep} {hasActiveStepReached}/>
{#if $isARActive}
  <ARFrame url={$activeARURL}/>
{/if}