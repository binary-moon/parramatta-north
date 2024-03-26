<script lang="ts">
  import type { ILatLong, ITourStep } from '$lib/types';
  import { onMount } from 'svelte';

  import TourSteps from '$lib/TourSteps.svelte';
  import { areTourDetailsExpanded, isTourStarted } from '$lib/store';

  import { loadScript } from '$lib/utilities/loadScript';

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

    if (deviceOrientation) {
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
    const color = isActive ? '#F3631B' : "#22272B"; // Active color or default color
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

    // if (tourSteps.length > 1) {
    //   const waypoints = tourSteps.slice(1, tourSteps.length - 1).map((step) => ({
    //     location: step.location,
    //     stopover: true,
    //   }));

    //   const origin = tourSteps[0].location;
    //   const destination = tourSteps[tourSteps.length - 1].location;

    //   directionsService.route(
    //     {
    //       origin: origin,
    //       destination: destination,
    //       waypoints: waypoints,
    //       travelMode: google.maps.TravelMode.WALKING,
    //     },
    //     (result, status) => {
    //       if (status === google.maps.DirectionsStatus.OK) {
    //         directionsRenderer.setDirections(result);
    //       } else {
    //         console.error(`Directions request failed due to ${status}`);
    //       }
    //     }
    //   );
    // }

    console.log(navigator.geolocation)

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

    areTourDetailsExpanded.set(false);
    isTourStarted.set(false);
  };

  const finishTour = () => {
    isTourStarted.set(false);
  }

  const requestDeviceOrientationPermission = async () => {
    console.log(DeviceOrientationEvent.requestPermission)
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
          console.log('Device Orientation permission denied');
        }
      } catch (error) {
        console.error('Error requesting Device Orientation permission:', error);
      }
    } else {
      // Handle browsers that don't support permission request
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
};

  onMount(() => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`, async () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: defaultLocation,
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
      preserveViewport: true,
      });
      userPathDirectionsRenderer.setMap(map);

      const module = await import('$lib/classes/UserMarker');
      UserMarker = module.UserMarker;

      if (window.DeviceOrientationEvent) {
        // window.addEventListener('deviceorientation', handleDeviceOrientation);
        requestDeviceOrientationPermission();
      }

      loadMarkersAndDrawRoute(map)
    });

    return () => {
      clearComponent();
    }
  })
</script>
<div id="map" class="h-full w-full"></div>
{#if !$areTourDetailsExpanded}
<button class="absolute top-10 right-6" on:click={finishTour}><img src="/Close_Button.png" alt="Close button" /></button>
{/if}
<TourSteps {tourSteps} {title} {activeStep} />