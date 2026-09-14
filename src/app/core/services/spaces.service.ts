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
import { Observable } from 'rxjs';
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
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
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
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
  }

  getById(id: string): Observable<SpaceModel> {
    const ref = doc(this.firestore, 'spaces', id);
    return docData(ref, { idField: 'id' }) as Observable<SpaceModel>;
  }

  getByHost(hostId: string): Observable<SpaceModel[]> {
    const q = query(this.spacesCollection, where('hostId', '==', hostId));
    return collectionData(q, { idField: 'id' }) as Observable<SpaceModel[]>;
  }

  async create(space: Omit<SpaceModel, 'id'>): Promise<void> {
    const newSpace = {
      ...space,
      publicationStatus: 'pending_approval' as const,
    };
    await addDoc(this.spacesCollection, newSpace);
  }

  updateStatus(id: string, status: SpaceModel['publicationStatus']): Promise<void> {
    const ref = doc(this.firestore, 'spaces', id);
    return updateDoc(ref, { publicationStatus: status });
  }
}
