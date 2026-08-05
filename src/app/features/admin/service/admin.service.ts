import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, limit } from '@angular/fire/firestore';
import { Observable, combineLatest, map } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { SpaceModel } from '../../../core/models/space.model';
import { DashboardMetrics } from '../../../core/models/dashboard-metrics.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private firestore = inject(Firestore);

  private usersCollection = collection(this.firestore, 'users');
  private spacesCollection = collection(this.firestore, 'spaces');

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return combineLatest([
      this.getUsers(),
      this.getSpaces()
    ]).pipe(
      map(([users, spaces]) => ({
        totalUsers: users.length,
        totalSpaces: spaces.length,
        totalBookings: 0,
        pendingHostRequests: users.filter(u => u.hostStatus === 'pending').length,
        pendingPublications: spaces.filter(s => s.publicationStatus === 'pending_approval').length,
        totalRevenue: 0
      }))
    );
  }

  getUsers(maxItems = 100): Observable<User[]> {
    const q = query(this.usersCollection, limit(maxItems));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  getSpaces(maxItems = 100): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, limit(maxItems));
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
  }

  getPendingHostRequests(maxItems = 50): Observable<User[]> {
    const q = query(this.usersCollection, where('hostStatus', '==', 'pending'), limit(maxItems));
    return collectionData(q, { idField: 'uid' }) as Observable<User[]>;
  }

  getPendingPublications(maxItems = 50): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, where('publicationStatus', '==', 'pending_approval'), limit(maxItems));
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
  }
}