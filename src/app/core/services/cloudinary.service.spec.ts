import { TestBed } from '@angular/core/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CloudinaryService] });
    service = TestBed.inject(CloudinaryService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the uploaded image URLs', async () => {
    let callback: any;
    const createUploadWidget = vi.fn((_opts: unknown, cb: any) => {
      callback = cb;
      return { open: vi.fn() };
    });
    vi.stubGlobal('cloudinary', { createUploadWidget });

    const promise = service.uploadImages();

    callback(null, { event: 'success', info: { secure_url: 'https://res.cloudinary.com/azzi5eiy/x.jpg' } });
    callback(null, { event: 'close' });

    expect(await promise).toEqual(['https://res.cloudinary.com/azzi5eiy/x.jpg']);
  });

  it('collects multiple uploaded images', async () => {
    let callback: any;
    const createUploadWidget = vi.fn((_opts: unknown, cb: any) => {
      callback = cb;
      return { open: vi.fn() };
    });
    vi.stubGlobal('cloudinary', { createUploadWidget });

    const promise = service.uploadImages();

    callback(null, { event: 'success', info: { secure_url: 'a.jpg' } });
    callback(null, { event: 'success', info: { secure_url: 'b.jpg' } });
    callback(null, { event: 'close' });

    expect(await promise).toEqual(['a.jpg', 'b.jpg']);
  });
});