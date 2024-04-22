export class PlaceMarker extends google.maps.OverlayView {
  constructor(position, map, image, isActive, onClick, index = 0) {
    super()
    this.position = position
    this.map = map
    this.image = image
    this.div = null
    this.isActive = isActive;
    this.index = index;
    this.onClick = onClick;
    this.setMap(map)
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.className = 'placeMarker';
    this.div.innerHTML = `<div class="placeMarkerTriangle"></div><div class="placeMarkerInner"><img src="${this.image}" alt="place marker" /></div>`;
    if (this.isActive) {
      this.div.classList.add('placeMarker--active');
    }

    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div);

    this.div.addEventListener('click', () => {
      if (this.onClick) {
        this.onClick(this);
      }
    })
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

  getPosition() {
    return this.position;
  }

  makeActive() {
    this.div.classList.add('placeMarker--active');
  }

  makeInactive() {
    this.div.classList.remove('placeMarker--active');
  }
}