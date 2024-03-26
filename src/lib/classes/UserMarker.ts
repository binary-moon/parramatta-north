export class UserMarker extends google.maps.OverlayView {
  constructor(position, map) {
    super()
    this.position = position
    this.map = map
    this.div = null
    this.setMap(map)
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.className = 'userMarker';
    this.div.innerHTML = '<span class="userMarkerInner"></span><span class="userMarkerDirection"></span>';

    this.div.style.zIndex = '1000';

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.markerLayer.appendChild(this.div);
  }

  draw() {
    // Use the map's projection to position the HTML element
    const overlayProjection = this.getProjection();
    const position = overlayProjection.fromLatLngToDivPixel(this.position);

    this.div.style.left = position.x + 'px';
    this.div.style.top = position.y + 'px';
  }

  onRemove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  }

  // Optional: update position method
  updatePosition(newPosition) {
    this.position = newPosition;
    if (this.div && this.map) {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(this.position);
      this.div.style.left = position.x + 'px';
      this.div.style.top = position.y + 'px';
    }
  }

  updateRotation(alpha: number) {
    if (this.div) {
      this.div.style.transform = `rotate(-${alpha}deg)`;
    }
  }

  getPosition() {
    return this.position
  }
}