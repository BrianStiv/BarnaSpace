import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { of, firstValueFrom, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

const mocks = vi.hoisted(() => ({
  authState: vi.fn(),
  docData: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('@angular/fire/auth', () => ({
  Auth: class {},
  authState: mocks.authState,
  user: vi.fn(),
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  signOut: mocks.signOut,
  updateProfile: mocks.updateProfile,
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  doc: mocks.doc,
  docData: mocks.docData,
  setDoc: mocks.setDoc,
}));

describe('AuthService', () => {
  let service: AuthService;
  let authState$: BehaviorSubject<any>;

  beforeEach(() => {
    vi.resetAllMocks();

    authState$ = new BehaviorSubject<any>(null);
    mocks.authState.mockReturnValue(authState$);

    mocks.doc.mockReturnValue({} as any);
    mocks.docData.mockReturnValue(of({}));
    mocks.setDoc.mockResolvedValue(undefined as any);
    mocks.createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: 'u1' } } as any);
    mocks.updateProfile.mockResolvedValue(undefined as any);
    mocks.signInWithEmailAndPassword.mockResolvedValue(undefined as any);
    mocks.signOut.mockResolvedValue(undefined as any);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  describe('isAdmin', () => {
    it('returns true for the admin email', () => {
      expect(service.isAdmin('admin.panel@barnaspaces.com')).toBe(true);
    });

    it('returns false for other emails', () => {
      expect(service.isAdmin('user@x.com')).toBe(false);
    });
  });

  describe('currentUser$', () => {
    it('emits null when there is no firebase user', async () => {
      authState$.next(null);

      const user = await firstValueFrom(service.currentUser$);

      expect(user).toBeNull();
    });

    it('maps the firebase user and doc data to a User', async () => {
      mocks.docData.mockReturnValue(of({ firstName: 'Ana', lastName: 'López', roles: ['client'], hostStatus: 'approved' }));
      authState$.next({ uid: 'u1', email: 'a@b.com', displayName: 'Ana' });

      const user = await firstValueFrom(service.currentUser$);

      expect(user).toEqual(expect.objectContaining({
        uid: 'u1',
        email: 'a@b.com',
        firstName: 'Ana',
        lastName: 'López',
        roles: ['client'],
        hostStatus: 'approved',
      }));
    });
  });

  describe('register', () => {
    it('creates the user and saves the user document', async () => {
      await service.register({ firstName: 'Ana', lastName: 'López', email: 'a@b.com', password: '123456' });

      expect(mocks.createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'a@b.com', '123456');
      expect(mocks.setDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('signs in with email and password', async () => {
      await service.login({ email: 'a@b.com', password: '123456' });

      expect(mocks.signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'a@b.com', '123456');
    });
  });

  describe('logout', () => {
    it('signs out', async () => {
      await service.logout();

      expect(mocks.signOut).toHaveBeenCalledTimes(1);
    });
  });
});