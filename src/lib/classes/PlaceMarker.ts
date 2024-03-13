export class PlaceMarker extends google.maps.OverlayView {
  constructor(position, map, image) {
    super()
    this.position = position
    this.map = map
    this.image = image
    this.div = null
    this.setMap(map)
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.className = 'placeMarker';
    this.div.innerHTML = `<div class="placeMarkerTriangle"></div><div class="placeMarkerInner"><img src="${this.image}" alt="place marker" /></div>`;

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.div);
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
}