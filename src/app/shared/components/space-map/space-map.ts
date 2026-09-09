import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  input,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-space-map',
  standalone: true,
  imports: [],
  template: `<div #mapContainer class="w-full h-64 rounded-lg overflow-hidden"></div>`,
  styles: [`:host { display: block; }`],
})
export class SpaceMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  lat = input<number>(0);
  lon = input<number>(0);
  label = input<string>('');
  approximate = input<boolean>(false);

  private map?: L.Map;

  ngAfterViewInit() {
    const lat = this.lat();
    const lon = this.lon();

    if (!lat || !lon) {
      return;
    }

    const zoom = this.approximate() ? 12 : 15;

    this.map = L.map(this.mapContainer.nativeElement).setView([lat, lon], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const popupText = this.approximate()
      ? (this.label() || 'Ubicación') + ' (aproximada)'
      : this.label() || 'Ubicación';

    L.marker([lat, lon], { icon: this.createIcon() })
      .addTo(this.map)
      .bindPopup(popupText);
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private createIcon(): L.DivIcon {
    return L.divIcon({
      className: 'space-map-marker',
      html: '<div style="width:20px;height:20px;border-radius:50%;background:#D96F32;border:3px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.4);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12],
    });
  }
}