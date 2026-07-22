import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  getCurrentUserFavorites(): Observable<string[]> {
    return user(this.auth).pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return of([]);
        }

        const userRef = doc(this.firestore, 'users', currentUser.uid);
        return docData(userRef).pipe(map((data: any) => (data?.favorites as string[]) ?? []));
      }),
    );
  }

  isFavorite(spaceId: string): Observable<boolean> {
    return this.getCurrentUserFavorites().pipe(map((favorites) => favorites.includes(spaceId)));
  }

  async toggleFavorite(spaceId: string): Promise<void> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userRef = doc(this.firestore, 'users', currentUser.uid);
    const snapshot = await docData(userRef).toPromise();
    const favorites = ((snapshot as any)?.favorites as string[]) ?? [];

    if (favorites.includes(spaceId)) {
      await updateDoc(userRef, {
        favorites: arrayRemove(spaceId),
      });
    } else {
      await updateDoc(userRef, {
        favorites: arrayUnion(spaceId),
      });
    }
  }
}
