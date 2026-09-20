import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  addDoc,
  doc,
  docData,
  updateDoc,
  QueryConstraint,
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { SpaceModel } from '../models/space.model';
import { SpaceCategory } from '../models/space-category.model';

export interface SpaceFilters {
  category?: SpaceCategory;
  neighborhood?: string;
  maxPrice?: number;
  minCapacity?: number;
  petFriendly?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  private firestore = inject(Firestore);
  private spacesCollection = collection(this.firestore, 'spaces');

  getPublished(): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, where('publicationStatus', '==', 'published'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((spaces) => this.sortByNewest(spaces as SpaceModel[])),
    );
  }

  filterSpaces(filters: SpaceFilters): Observable<SpaceModel[]> {
    const constraints: QueryConstraint[] = [where('publicationStatus', '==', 'published')];

    if (filters.category) {
      constraints.push(where('categories', 'array-contains', filters.category));
    }

    if (filters.neighborhood) {
      constraints.push(where('location.neighborhood', '==', filters.neighborhood));
    }

    if (filters.maxPrice) {
      constraints.push(where('dailyPrice', '<=', filters.maxPrice));
    }

    if (filters.minCapacity) {
      constraints.push(where('capacity', '>=', filters.minCapacity));
    }

    if (filters.petFriendly) {
      constraints.push(where('amenities', 'array-contains', 'pet_friendly'));
    }

    const q = query(this.spacesCollection, ...constraints);
    return collectionData(q, { idField: 'id' }).pipe(
      map((spaces) => this.sortByNewest(spaces as SpaceModel[])),
    );
  }

  getById(id: string): Observable<SpaceModel> {
    const ref = doc(this.firestore, 'spaces', id);
    return docData(ref, { idField: 'id' }) as Observable<SpaceModel>;
  }

  getByHost(hostId: string): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, where('hostId', '==', hostId));
    return collectionData(q, { idField: 'id' }).pipe(
      map((spaces) => this.sortByNewest(spaces as SpaceModel[])),
    );
  }

  async create(space: Omit<SpaceModel, 'id'>): Promise<void> {
    const newSpace = {
      ...space,
      publicationStatus: 'pending_approval' as const,
      createdAt: new Date(),
    };
    await addDoc(this.spacesCollection, newSpace);
  }

  updateStatus(id: string, status: SpaceModel['publicationStatus']): Promise<void> {
    const ref = doc(this.firestore, 'spaces', id);
    return updateDoc(ref, { publicationStatus: status });
  }

  private sortByNewest(spaces: SpaceModel[]): SpaceModel[] {
    return [...spaces].sort((a, b) => {
      const dateA = this.toTime(a.createdAt);
      const dateB = this.toTime(b.createdAt);
      if (dateB !== dateA) return dateB - dateA;
      return (b.id ?? '').localeCompare(a.id ?? '');
    });
  }

  private toTime(value: unknown): number {
    if (!value) return 0;
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'object' && value !== null && 'toDate' in value) {
      return (value as { toDate: () => Date }).toDate().getTime();
    }
    const t = new Date(value as string | number).getTime();
    return Number.isNaN(t) ? 0 : t;
  }
}