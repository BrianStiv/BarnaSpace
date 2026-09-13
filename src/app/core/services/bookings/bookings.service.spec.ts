import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { of, firstValueFrom } from 'rxjs';
import { BookingsService } from '../bookings.service';
import { SpacesService } from '../spaces.service';

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  collectionData: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  doc: vi.fn(),
  docData: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  user: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: mocks.collection,
  collectionData: mocks.collectionData,
  query: mocks.query,
  where: mocks.where,
  limit: mocks.limit,
  doc: mocks.doc,
  docData: mocks.docData,
  addDoc: mocks.addDoc,
  updateDoc: mocks.updateDoc,
  writeBatch: mocks.writeBatch,
  arrayUnion: mocks.arrayUnion,
  arrayRemove: mocks.arrayRemove,
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  user: mocks.user,
}));

describe('BookingsService', () => {
  let service: BookingsService;
  let spacesService: { getById: ReturnType<typeof vi.fn> };
  let authMock: { currentUser: unknown };
  let batchUpdate: ReturnType<typeof vi.fn>;
  let batchCommit: ReturnType<typeof vi.fn>;

  const mockUser = { uid: 'u1', displayName: 'Juan', email: 'juan@x.com' };

  beforeEach(() => {
    vi.resetAllMocks();

    mocks.collection.mockReturnValue({} as any);
    mocks.query.mockReturnValue({} as any);
    mocks.where.mockReturnValue({} as any);
    mocks.limit.mockReturnValue({} as any);
    mocks.doc.mockImplementation((_fs: unknown, path: string, id: string) => ({ collection: path, id }));
    mocks.addDoc.mockResolvedValue(undefined as any);
    mocks.updateDoc.mockResolvedValue(undefined as any);
    mocks.arrayUnion.mockImplementation((v: unknown) => v);
    mocks.arrayRemove.mockImplementation((v: unknown) => v);

    batchUpdate = vi.fn();
    batchCommit = vi.fn().mockResolvedValue(undefined);
    mocks.writeBatch.mockReturnValue({ update: batchUpdate, commit: batchCommit } as any);

    authMock = { currentUser: mockUser };
    spacesService = { getById: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        BookingsService,
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: authMock },
        { provide: SpacesService, useValue: spacesService },
      ],
    });

    service = TestBed.inject(BookingsService);
  });

  describe('checkAvailability', () => {
    it('returns true when the date is not blocked', async () => {
      spacesService.getById.mockReturnValue(of({ blockedDates: ['2026-01-05'] }));
      expect(await service.checkAvailability('space1', '2026-01-10')).toBe(true);
    });

    it('returns false when the date is blocked', async () => {
      spacesService.getById.mockReturnValue(of({ blockedDates: ['2026-01-10'] }));
      expect(await service.checkAvailability('space1', '2026-01-10')).toBe(false);
    });
  });

  describe('createBooking', () => {
    it('creates a pending booking with the correct payload', async () => {
      const space = { id: 'space1', name: 'Mi Espacio', hostId: 'host1', dailyPrice: 100 } as any;
      await service.createBooking(space, '2026-01-10', 4);

      expect(mocks.addDoc).toHaveBeenCalledTimes(1);
      const payload = mocks.addDoc.mock.calls[0][1] as any;
      expect(payload.spaceId).toBe('space1');
      expect(payload.status).toBe('pending');
      expect(payload.paymentStatus).toBe('pending');
      expect(payload.totalPrice).toBe(100);
      expect(payload.clientId).toBe('u1');
    });

    it('throws an error when there is no authenticated user', async () => {
      authMock.currentUser = null;
      const space = { id: 'space1', name: 'Mi Espacio', hostId: 'host1', dailyPrice: 100 } as any;
      await expect(service.createBooking(space, '2026-01-10', 4)).rejects.toThrow('Debes iniciar sesion');
    });
  });

  describe('approveBooking', () => {
    it('confirms the booking and blocks the date', async () => {
      const booking = { id: 'b1', spaceId: 'space1', date: '2026-01-10' } as any;
      await service.approveBooking(booking);

      expect(batchUpdate).toHaveBeenCalledWith({ collection: 'bookings', id: 'b1' }, { status: 'confirmed', paymentStatus: 'paid' });
      expect(batchUpdate).toHaveBeenCalledWith({ collection: 'spaces', id: 'space1' }, { blockedDates: '2026-01-10' });
      expect(batchCommit).toHaveBeenCalledTimes(1);
    });
  });

  describe('rejectBooking', () => {
    it('marks the booking as rejected', async () => {
      const booking = { id: 'b1' } as any;
      await service.rejectBooking(booking);

      expect(mocks.updateDoc).toHaveBeenCalledWith({ collection: 'bookings', id: 'b1' }, { status: 'rejected', paymentStatus: 'released' });
    });
  });

  describe('cancelBooking', () => {
    it('cancels a confirmed booking and releases the date', async () => {
      const booking = { id: 'b1', spaceId: 'space1', date: '2026-01-10', status: 'confirmed' } as any;
      await service.cancelBooking(booking);

      expect(batchUpdate).toHaveBeenCalledWith({ collection: 'bookings', id: 'b1' }, { status: 'cancelled', paymentStatus: 'released' });
      expect(batchUpdate).toHaveBeenCalledWith({ collection: 'spaces', id: 'space1' }, { blockedDates: '2026-01-10' });
    });

    it('does not release the date if the booking was not confirmed', async () => {
      const booking = { id: 'b1', spaceId: 'space1', date: '2026-01-10', status: 'pending' } as any;
      await service.cancelBooking(booking);

      expect(batchUpdate).toHaveBeenCalledTimes(1);
      expect(mocks.arrayRemove).not.toHaveBeenCalled();
    });
  });

  describe('getHostRevenue', () => {
    it('sums only the confirmed bookings', async () => {
      const bookings = [
        { status: 'confirmed', totalPrice: 100 },
        { status: 'confirmed', totalPrice: 50 },
        { status: 'pending', totalPrice: 999 },
      ];
      mocks.user.mockReturnValue(of(mockUser));
      mocks.collectionData.mockReturnValue(of(bookings));

      const revenue = await firstValueFrom(service.getHostRevenue());
      expect(revenue).toBe(150);
    });
  });

  describe('getBookingsByClient', () => {
    it('returns an empty array when there is no user', async () => {
      mocks.user.mockReturnValue(of(null));

      const result = await firstValueFrom(service.getBookingsByClient());
      expect(result).toEqual([]);
    });
  });
});