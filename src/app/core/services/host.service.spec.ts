import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { HostService } from './host.service';

const mocks = vi.hoisted(() => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(),
  collectionData: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  addDoc: vi.fn(),
  doc: mocks.doc,
  docData: vi.fn(),
  updateDoc: mocks.updateDoc,
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  user: vi.fn(),
}));

describe('HostService', () => {
  let service: HostService;
  let authMock: { currentUser: unknown };

  beforeEach(() => {
    vi.resetAllMocks();

    mocks.doc.mockImplementation((_fs: unknown, path: string, id: string) => ({ collection: path, id }));
    mocks.updateDoc.mockResolvedValue(undefined as any);

    authMock = { currentUser: { uid: 'u1' } };

    TestBed.configureTestingModule({
      providers: [
        HostService,
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: authMock },
      ],
    });

    service = TestBed.inject(HostService);
  });

  it('throws when the user is not authenticated', async () => {
    authMock.currentUser = null;

    await expect(
      service.applyForHost({ firstName: 'Ana', lastName: 'X', phone: '123', hostData: {} } as any),
    ).rejects.toThrow('User not authenticated');
  });

  it('updates the user with pending status and returns the uid', async () => {
    const result = await service.applyForHost({ firstName: 'Ana', lastName: 'X', phone: '123', hostData: {} } as any);

    expect(result).toBe('u1');
    expect(mocks.updateDoc).toHaveBeenCalledWith(
      { collection: 'users', id: 'u1' },
      expect.objectContaining({ hostStatus: 'pending', firstName: 'Ana', lastName: 'X', phone: '123' }),
    );
  });
});