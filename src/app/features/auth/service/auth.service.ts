import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User, createUserDefaults } from '../../../core/models/user.model';
import { environment } from '../../../../environment/environment';
import { LoginRequest, RegisterRequest } from '../../../core/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private defaults = createUserDefaults();

  currentUser$: Observable<User | null> = authState(this.auth).pipe(
    switchMap((firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        return of(null);
      }

      const userRef = doc(this.firestore, 'users', firebaseUser.uid);
      return docData(userRef).pipe(
        map((data: any) => {
          if (!data) {
            return null;
          }

          return {
            uid: firebaseUser.uid,
            firstName: data.firstName ?? firebaseUser.displayName ?? '',
            lastName: data.lastName ?? '',
            phone: data.phone ?? '',
            email: firebaseUser.email ?? '',
            roles: data.roles ?? this.defaults.roles,
            hostStatus: data.hostStatus ?? this.defaults.hostStatus,
            hostData: data.hostData,
            favorites: data.favorites ?? this.defaults.favorites,
            profileImage: data.profileImage,
            createdAt: data.createdAt?.toDate(),
          } as User;
        }),
      );
    }),
  );

  async login(credentials: LoginRequest): Promise<void> {
    await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  async register(data: RegisterRequest): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
    const fullName = `${data.firstName} ${data.lastName}`;
    await updateProfile(credential.user, { displayName: fullName });
    await this.createUserDocument(credential.user.uid, data.firstName, data.lastName, data.email);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.createUserDocument(
      credential.user.uid,
      credential.user.displayName ?? '',
      '',
      credential.user.email ?? '',
    );
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAdmin(email: string): boolean {
    return email === environment.adminEmail;
  }

  getHomeRoute(): Observable<string> {
    return this.currentUser$.pipe(
      take(1),
      map((user) => {
        if (user?.roles.includes('admin')) return '/admin/dashboard';
        if (user?.roles.includes('host') && user.hostStatus === 'approved') return '/host/panel';
        return '/marketplace';
      }),
    );
  }

  private async createUserDocument(uid: string, firstName: string, lastName: string, email: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);

    const userDoc: Partial<User> = {
      uid,
      firstName,
      lastName,
      email,
      roles: this.isAdmin(email) ? ['admin'] : this.defaults.roles,
      hostStatus: this.defaults.hostStatus,
      favorites: this.defaults.favorites,
      createdAt: new Date(),
    };

    await setDoc(userRef, userDoc);
  }
}