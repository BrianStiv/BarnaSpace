import { Injectable } from '@angular/core';

export interface GeocodingResult {
  lat: number;
  lon: number;
  precision: 'exact' | 'approximate';
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {

  async geocode(
    address: string,
    city: string,
    zipCode: string,
  ): Promise<GeocodingResult> {
    const queries: { q: string; precision: GeocodingResult['precision'] }[] = [
      { q: `${address}, ${city}`, precision: 'exact' },
      { q: address, precision: 'exact' },
    ];

    if (zipCode) {
      queries.push(
        { q: `${zipCode}, ${city}`, precision: 'approximate' },
        { q: zipCode, precision: 'approximate' },
      );
    }

    queries.push({ q: city, precision: 'approximate' });

    for (const query of queries) {
      try {
        const coords = await this.search(query.q);
        return { lat: coords.lat, lon: coords.lon, precision: query.precision };
      } catch {
      }
    }

    throw new Error('No se encontró la ubicación');
  }

  private async search(q: string): Promise<{ lat: number; lon: number }> {
    const params = new URLSearchParams({ format: 'json', q, limit: '1' });
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'User-Agent': 'BarnaSpace' } },
    );

    if (!response.ok) {
      throw new Error('Error al geocodificar');
    }

    const data = await response.json();
    if (!data.length) {
      throw new Error('No se encontró la ubicación');
    }

    return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
  }
}