<script lang="ts">
  import { onMount } from 'svelte';

  import TourSteps from '$lib/TourSteps.svelte';
  import ARFrame from '$lib/ARFrame.svelte';

  import { areTourDetailsExpanded, isTourStarted, isARActive, activeARURL } from '$lib/store';
  import { loadScript, removeScript } from '$lib/utilities/loadScript';

  import type { ILatLong, ITourStep } from '$lib/types';

  const theme = import.meta.env.VITE_THEME;
  const brandColor = theme === 'rgb' ? '#146CFD' : '#F3631B';

  let map: google.maps.Map;
  let directionsService: google.maps.DirectionsService;
  let directionsRenderer: google.maps.DirectionsRenderer;
  let userPathDirectionsRenderer: google.maps.DirectionsRenderer;
  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
  let activeStep: number = 1;
  let watchId: number | null;
  let UserMarker: any;
  let userMarker: any | null = null;
  let hasActiveStepReached: boolean = false;
  let sortedTourSteps: ITourStep[] = [];

  export let tourSteps: ITourStep[] = [];
  export let title: string = '';
  export let defaultLocation: ILatLong = { lat: -33.74069085195705, lng: 151.0442223807315 };

  let markers: google.maps.Marker[] = [];

  // Store the event handler in a variable so we can remove it properly
  const messageHandler = (event: MessageEvent) => removeARFrame(event);

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

  const handleNextStepButton = () => {
    activeStep++;
    markers = markers.slice(); // Force reactivity
    hasActiveStepReached = false;
  }

  const drawUserMarkerAndUpdateLocation = () => {
    console.log('drawUserMarkerAndUpdateLocation')
    watchId = navigator.geolocation.watchPosition((position) => {
      const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      if (!userMarker) {
        userMarker = new UserMarker(userLocation, map);
      } else {
        userMarker.updatePosition(userLocation);
      }

      drawPathToActiveMarker(userLocation);
      checkDistanceToActiveMarker(userLocation);
    },
    (error) => {
      console.error('watchPosition error:', error);
    },
    { enableHighAccuracy: true });
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
    sortedTourSteps.forEach((step, index) => {
      let marker = new google.maps.Marker({
        position: step.location,
        map,
        title: `Step ${index + 1}`,
        label: {
          text: `${index + 1}`, // Label text
          color: "#FFFFFF", 
          fontSize: "14px",
          fontWeight: "bold",
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
    console.log('unmounting')
    removeScript(googleMapsUrl);

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    if (userMarker) {
      userMarker.onRemove();
      userMarker = null;
    }

    // Remove event listeners with the stored handler reference
    window.removeEventListener('message', messageHandler);

    // Reset arrays and variables
    markers = [];
    sortedTourSteps = [];

    areTourDetailsExpanded.set(false);
    isTourStarted.set(false);
  };

  const finishTour = () => {
    isTourStarted.set(false);
  }

  const sortTourStepsByUserLocation = (userLocation: google.maps.LatLng) => {
    console.log({tourSteps})
    return tourSteps.sort((a, b) => {
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

  const removeARFrame = (event: MessageEvent) => {
    const eventData = event.data;
    if (eventData.action === 'exitAR') {
      isARActive.set(false);
    }
  }

  onMount(() => {
    console.log('on mount!!')
    loadScript(googleMapsUrl, async () => {
      console.log('script loaded')
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
          strokeColor: "#22272B",
          strokeOpacity: 1,
          strokeWeight: 4,
          zIndex: 1,
        },
        suppressMarkers: true,
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

      console.log({UserMarker})

      setTimeout(() => {
        console.log('timeout')
        console.log(navigator.geolocation)
        if (navigator.geolocation) {
          console.log('geolocation available')
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('position acquired', position)
              const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              console.log('userLocation:', userLocation)
              sortedTourSteps = sortTourStepsByUserLocation(userLocation); 
              loadMarkersAndDrawRoute(map);
              drawUserMarkerAndUpdateLocation();
            },
            (error) => {
              console.error('getCurrentPosition error:', error);
              // Fallback: Just load markers if we can't get user position
              sortedTourSteps = tourSteps;
              loadMarkersAndDrawRoute(map);
            },
            { enableHighAccuracy: false, timeout: 3000, maximumAge: 0 }
          );
        } else {
          console.log('no geolocation')
          // Fallback if no geolocation
          sortedTourSteps = tourSteps;
          loadMarkersAndDrawRoute(map);
        }
      }, 1000)
    });

    window.addEventListener('message', messageHandler);

    return () => {
      clearComponent();
    }
  })
</script>

<div id="map" class="h-full w-full"></div>
{#if !$areTourDetailsExpanded}
  <button class="absolute top-10 right-6" on:click={finishTour}><img src="/Close_Button.png" alt="Close button" /></button>
{/if}
{#if sortedTourSteps.length > 0}
  {#if hasActiveStepReached && activeStep < sortedTourSteps.length}
    <button on:click={handleNextStepButton} class="absolute top-[68%] left-1/2 -translate-x-[50%] bg-white font-bold rounded-full p-[10px] gap-2 flex shadow-md"><img src="/Travel_Icon.svg" alt="travel icon"/>Go to point {activeStep + 1}</button>
  {/if}
  <TourSteps tourSteps={sortedTourSteps} {title} {activeStep} {hasActiveStepReached}/>
{/if}
{#if $isARActive}
  <ARFrame url={$activeARURL}/>
{/if}
