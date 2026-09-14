import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { AdminService } from './admin.service';
import { BookingsService } from '../../../core/services/bookings.service';

const mocks = vi.hoisted(() => ({
  collection: vi.fn(),
  collectionData: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
  arrayUnion: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: mocks.collection,
  collectionData: mocks.collectionData,
  query: mocks.query,
  where: mocks.where,
  limit: mocks.limit,
  doc: mocks.doc,
  updateDoc: mocks.updateDoc,
  writeBatch: mocks.writeBatch,
  arrayUnion: mocks.arrayUnion,
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
}));

describe('AdminService', () => {
  let service: AdminService;
  let bookingsService: { getAllBookings: ReturnType<typeof vi.fn> };

  const usuarios = [
    { hostStatus: 'pending', roles: ['client'] },
    { hostStatus: 'approved', roles: ['host'] },
  ];

  const espacios = [
    { publicationStatus: 'pending_approval' },
    { publicationStatus: 'published' },
  ];

  const reservas = [
    { status: 'confirmed', totalPrice: 100 },
    { status: 'confirmed', totalPrice: 50 },
    { status: 'pending', totalPrice: 999 },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    mocks.collection.mockReturnValue({} as any);
    mocks.query.mockReturnValue({} as any);
    mocks.where.mockReturnValue({} as any);
    mocks.limit.mockReturnValue({} as any);
    mocks.doc.mockReturnValue({} as any);

    bookingsService = { getAllBookings: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AdminService,
        { provide: Firestore, useValue: {} },
        { provide: BookingsService, useValue: bookingsService },
      ],
    });

    service = TestBed.inject(AdminService);
  });

  it('getDashboardMetrics calculates totals, pending and revenue', () => {
    vi.spyOn(service, 'getUsers').mockReturnValue(of(usuarios as any));
    vi.spyOn(service, 'getSpaces').mockReturnValue(of(espacios as any));
    bookingsService.getAllBookings.mockReturnValue(of(reservas as any));

    let resultado: any;
    service.getDashboardMetrics().subscribe((r) => (resultado = r));

    expect(resultado).toEqual({
      totalUsers: 2,
      totalSpaces: 2,
      totalBookings: 3,
      pendingHostRequests: 1,
      pendingPublications: 1,
      totalRevenue: 150,
    });
  });
});