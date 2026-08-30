import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, limit, doc, writeBatch, arrayUnion, updateDoc } from '@angular/fire/firestore';
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

  getSpaceByHostId(hostId: string): Observable<SpaceModel | undefined> {
    const q = query(
      this.spacesCollection,
      where('hostId', '==', hostId),
      where('publicationStatus', '==', 'pending_approval'),
      limit(1),
    );
    return collectionData(q, { idField: 'id' }).pipe(map((spaces) => spaces[0] as SpaceModel | undefined));
  }

  getSpacesByStatus(status: SpaceModel['publicationStatus'], maxItems = 100): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, where('publicationStatus', '==', status), limit(maxItems));
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
  }

  async approveHostRequest(uid: string, spaceId: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    const userRef = doc(this.firestore, 'users', uid);
    const spaceRef = doc(this.firestore, 'spaces', spaceId);

    batch.update(userRef, {
      roles: arrayUnion('host'),
      hostStatus: 'approved',
    });

    batch.update(spaceRef, {
      publicationStatus: 'published',
    });

    await batch.commit();
  }

  async rejectHostRequest(uid: string, spaceId: string, reason?: string): Promise<void> {
    const batch = writeBatch(this.firestore);
    const userRef = doc(this.firestore, 'users', uid);
    const spaceRef = doc(this.firestore, 'spaces', spaceId);

    const spaceUpdate: Partial<SpaceModel> = {
      publicationStatus: 'rejected',
    };

    if (reason) {
      spaceUpdate.rejectionReason = reason;
    }

    batch.update(userRef, {
      hostStatus: 'rejected',
    });

    batch.update(spaceRef, spaceUpdate);

    await batch.commit();
  }

  async approvePublication(id: string): Promise<void> {
    const spaceRef = doc(this.firestore, 'spaces', id);
    await updateDoc(spaceRef, { publicationStatus: 'published' });
  }

  async rejectPublication(id: string, reason?: string): Promise<void> {
    const spaceRef = doc(this.firestore, 'spaces', id);
    const update: Partial<SpaceModel> = { publicationStatus: 'rejected' };

    if (reason) {
      update.rejectionReason = reason;
    }

    await updateDoc(spaceRef, update);
  }

  async deactivatePublication(id: string): Promise<void> {
    const spaceRef = doc(this.firestore, 'spaces', id);
    await updateDoc(spaceRef, { publicationStatus: 'deactivated' });
  }
}