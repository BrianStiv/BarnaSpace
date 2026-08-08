import { HostData } from './host-data.model';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  roles: ('client' | 'host' | 'admin')[];
  profileImage?: string;
  favorites?: string[];
  createdAt?: Date;
  hostStatus?: 'not_applicable' | 'pending' | 'approved' | 'rejected';
  hostData?: HostData;
}

export function createUserDefaults() {
  return {
    roles: ['client'],
    hostStatus: 'not_applicable',
    favorites: [],
  } satisfies Pick<User, 'roles' | 'hostStatus' | 'favorites'>;
}