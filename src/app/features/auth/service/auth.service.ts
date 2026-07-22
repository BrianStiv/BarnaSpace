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
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

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
            email: firebaseUser.email ?? '',
            name: data.name ?? firebaseUser.displayName ?? '',
            phone: data.phone ?? '',
            roles: data.roles ?? ['client'],
            hostStatus: data.hostStatus ?? 'not_applicable',
            hostData: data.hostData,
            favorites: data.favorites ?? [],
            createdAt: data.createdAt?.toDate(),
          } as User;
        }),
      );
    }),
  );

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, name: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await this.createUserDocument(credential.user.uid, email, name);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.createUserDocument(
      credential.user.uid,
      credential.user.email ?? '',
      credential.user.displayName ?? '',
    );
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isAdmin(email: string): boolean {
    return email === environment.adminEmail;
  }

  private async createUserDocument(uid: string, email: string, name: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);

    const userDoc: Partial<User> = {
      uid,
      email,
      name,
      roles: this.isAdmin(email) ? ['admin'] : ['client'],
      hostStatus: 'not_applicable',
      favorites: [],
      createdAt: new Date(),
    };

    await setDoc(userRef, userDoc);
  }
}
