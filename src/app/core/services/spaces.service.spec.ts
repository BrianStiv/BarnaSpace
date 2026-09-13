import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SpacesService } from './spaces.service';

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  collectionData: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  docData: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: mocks.collection,
  collectionData: mocks.collectionData,
  query: mocks.query,
  where: mocks.where,
  addDoc: mocks.addDoc,
  doc: mocks.doc,
  docData: mocks.docData,
  updateDoc: mocks.updateDoc,
}));

describe('SpacesService', () => {
  let service: SpacesService;

  beforeEach(() => {
    vi.resetAllMocks();

    mocks.collection.mockReturnValue({} as any);
    mocks.query.mockReturnValue({} as any);
    mocks.where.mockReturnValue({} as any);
    mocks.doc.mockImplementation((_fs: unknown, path: string, id: string) => ({ collection: path, id }));
    mocks.addDoc.mockResolvedValue(undefined as any);
    mocks.updateDoc.mockResolvedValue(undefined as any);

    TestBed.configureTestingModule({
      providers: [SpacesService, { provide: Firestore, useValue: {} }],
    });

    service = TestBed.inject(SpacesService);
  });

  it('create adds a space with pending_approval status', async () => {
    await service.create({ name: 'Terraza' } as any);

    expect(mocks.addDoc).toHaveBeenCalledTimes(1);
    const payload = mocks.addDoc.mock.calls[0][1];
    expect(payload.publicationStatus).toBe('pending_approval');
    expect(payload.name).toBe('Terraza');
  });

  it('filterSpaces builds the correct where constraints', () => {
    service.filterSpaces({
      category: 'birthday_family',
      neighborhood: 'Gràcia',
      maxPrice: 100,
      minCapacity: 10,
      petFriendly: true,
    });

    expect(mocks.where).toHaveBeenCalledWith('publicationStatus', '==', 'published');
    expect(mocks.where).toHaveBeenCalledWith('categories', 'array-contains', 'birthday_family');
    expect(mocks.where).toHaveBeenCalledWith('location.neighborhood', '==', 'Gràcia');
    expect(mocks.where).toHaveBeenCalledWith('dailyPrice', '<=', 100);
    expect(mocks.where).toHaveBeenCalledWith('capacity', '>=', 10);
    expect(mocks.where).toHaveBeenCalledWith('amenities', 'array-contains', 'pet_friendly');
  });

  it('updateStatus updates the publication status', async () => {
    await service.updateStatus('space1', 'published');

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { collection: 'spaces', id: 'space1' },
      { publicationStatus: 'published' },
    );
  });
});