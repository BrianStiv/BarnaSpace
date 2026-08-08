import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async applyForHost(
    userData: Pick<User, 'firstName' | 'lastName' | 'phone' | 'hostData'>,
  ): Promise<string> {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const userRef = doc(this.firestore, 'users', currentUser.uid);

    await updateDoc(userRef, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      hostData: userData.hostData,
      hostStatus: 'pending',
    });

    return currentUser.uid;
  }
}