import { Location } from './location.model';
import { SpaceCategory } from './space-category.model';
import { Amenity } from './amenity.model';


export interface SpaceModel {
  id?: string;
  name: string;
  description: string;
  dailyPrice: number;
  location: Location;
  squareMeters: number;
  capacity: number;
  categories: SpaceCategory[];
  amenities: Amenity[];
  blockedDates: string[];
  images: string[];
  hostId: string;
  publicationStatus: 'pending_approval' | 'published' | 'rejected' | 'deactivated';
  hasDamageInsurance?: boolean;
  rejectionReason?: string;
}
