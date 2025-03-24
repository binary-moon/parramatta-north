<script lang="ts">
  import { onMount } from "svelte";

  import EventPlaceDetails from "./EventPlaceDetails.svelte";

  import { loadScript } from '$lib/utilities/loadScript';
  import type { ILatLong } from '$lib/types';

  export let places: {
    location: ILatLong;
    mapImage?: string;
    [key: string]: any;
  }[] = [];

  let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let map: google.maps.Map;
  let UserMarker: any;
  let userMarker: any | null = null;
  let PlaceMarker: any;
  let placeMarkers: any[] = [];
  let userLocation: google.maps.LatLng | null = null;
  let activePlace: number = 0;
  let watchId: number | null = null;
  let deviceOrientation: DeviceOrientationEvent | null = null;
  const mapImagePlaceholder = 'https://placehold.co/255x255/black/333';

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

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    deviceOrientation = event;
    let heading: number | null = null;
    
    // Check if webkitCompassHeading is available and a number
    if ('webkitCompassHeading' in event && typeof event.webkitCompassHeading === 'number') {
      heading = event.webkitCompassHeading;
    } else if (typeof event.alpha === 'number') {
      heading = event.alpha;
    }
    
    // Update rotation only if heading is available and userMarker exists
    if (heading !== null && userMarker) {
      userMarker.updateRotation(heading);
    }
  };

  const drawUserMarkerAndUpdateLocation = () => {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        if (!userMarker) {
          userMarker = new UserMarker(userLocation, map);
        } else {
          userMarker.updatePosition(userLocation);
        }
      }, 
      (error) => {
        console.error('watchPosition error:', error);
      },
      { enableHighAccuracy: true }
    );
  }

  const handleMarkerClick = (marker: any) => {
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
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`, async () => {
      map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: places[0].location,
        zoom: 17,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
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

      const module = await import('$lib/classes/UserMarker');
      UserMarker = module.UserMarker;

      const placeMarkerModule = await import('$lib/classes/PlaceMarker');
      PlaceMarker = placeMarkerModule.PlaceMarker;

      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            sortTourStepsByUserLocation(userLocation); // Sort tour steps based on user location
            loadMarkersAndDrawRoute(map);
            drawUserMarkerAndUpdateLocation();
          }, 
          (error) => {
            console.error('getCurrentPosition error:', error);
            // Fallback: Just load markers if we can't get user position
            loadMarkersAndDrawRoute(map);
          }, 
          { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
        );
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