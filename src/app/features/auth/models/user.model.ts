import { HostData } from './host-data.model';

export interface User {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  roles: ('client' | 'host' | 'admin');
  hostStatus?: 'not_applicable' | 'pending' | 'approved' | 'rejected';
  hostData?: HostData;
  favorites?: string[];
  createdAt?: Date;
}
