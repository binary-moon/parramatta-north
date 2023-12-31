import { writable } from 'svelte/store'

interface Location {
  lat: number;
  lng: number;
}

export const targetLocation = writable({ lat: -33.74020, lng: 151.04561 })

export function setTargetLocation(location: Location) {
  targetLocation.set(location);
}