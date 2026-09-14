import { TestBed } from '@angular/core/testing';
import { GeocodingService } from './geocoding.service';

describe('GeocodingService', () => {
  let service: GeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GeocodingService] });
    service = TestBed.inject(GeocodingService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns exact precision when the address is found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ lat: '41.38', lon: '2.17' }],
    }));

    const result = await service.geocode('Plaça Catalunya', 'Barcelona', '');

    expect(result).toEqual({ lat: 41.38, lon: 2.17, precision: 'exact' });
  });

  it('falls back to approximate when the address is not found', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ lat: '41.38', lon: '2.17' }] }));

    const result = await service.geocode('Calle Falsa', 'Barcelona', '08002');

    expect(result).toEqual({ lat: 41.38, lon: 2.17, precision: 'approximate' });
  });

  it('throws when no location is found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    await expect(service.geocode('Calle Falsa', 'Barcelona', '')).rejects.toThrow('No se encontró la ubicación');
  });
});