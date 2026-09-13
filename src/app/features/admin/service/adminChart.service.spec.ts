import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { AdminChartService } from './AdminChart.service';
import { AdminService } from './admin.service';
import { BookingsService } from '../../../core/services/bookings.service';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
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
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  user: vi.fn(),
}));

describe('AdminChartService', () => {
  let service: AdminChartService;
  let adminServiceMock: { getUsers: ReturnType<typeof vi.fn>; getSpaces: ReturnType<typeof vi.fn> };
  let bookingsServiceMock: { getAllBookings: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    adminServiceMock = {
      getUsers: vi.fn().mockReturnValue(of([])),
      getSpaces: vi.fn().mockReturnValue(of([])),
    };
    bookingsServiceMock = {
      getAllBookings: vi.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        AdminChartService,
        { provide: AdminService, useValue: adminServiceMock },
        { provide: BookingsService, useValue: bookingsServiceMock },
      ],
    });

    service = TestBed.inject(AdminChartService);
  });

  it('counts approved hosts and clients', async () => {
    adminServiceMock.getUsers.mockReturnValue(of([
      { roles: ['client'], hostStatus: 'not_applicable' },
      { roles: ['host'], hostStatus: 'approved' },
      { roles: ['host'], hostStatus: 'pending' },
      { roles: ['admin'], hostStatus: 'not_applicable' },
    ]));

    const result = await firstValueFrom(service.getUsersByRole());

    expect(result).toEqual({ clients: 2, hosts: 1 });
  });

  it('counts bookings by status', async () => {
    bookingsServiceMock.getAllBookings.mockReturnValue(of([
      { status: 'pending' },
      { status: 'confirmed' },
      { status: 'confirmed' },
      { status: 'cancelled' },
    ]));

    const result = await firstValueFrom(service.getBookingsByStatus());

    expect(result).toEqual([
      { status: 'pending', count: 1 },
      { status: 'confirmed', count: 2 },
      { status: 'rejected', count: 0 },
      { status: 'cancelled', count: 1 },
    ]);
  });

  it('counts spaces by publication status', async () => {
    adminServiceMock.getSpaces.mockReturnValue(of([
      { publicationStatus: 'published' },
      { publicationStatus: 'published' },
      { publicationStatus: 'rejected' },
    ]));

    const result = await firstValueFrom(service.getSpacesByStatusCount());

    expect(result).toEqual([
      { status: 'pending_approval', count: 0 },
      { status: 'published', count: 2 },
      { status: 'rejected', count: 1 },
      { status: 'deactivated', count: 0 },
    ]);
  });

  it('groups bookings by month', async () => {
    bookingsServiceMock.getAllBookings.mockReturnValue(of([
      { date: '2026-01-10' },
      { date: '2026-01-15' },
      { date: '2026-02-05' },
    ]));

    const result = await firstValueFrom(service.getBookingsByMonth());

    expect(result).toEqual([
      { month: '2026-01', count: 2 },
      { month: '2026-02', count: 1 },
    ]);
  });
});