export type Amenity =
  | 'pet_friendly'
  | 'barbecue'
  | 'pool'
  | 'billiard'
  | 'projector'
  | 'wifi'
  | 'tv';

export const AMENITIES: Amenity[] = [
  'pet_friendly',
  'barbecue',
  'pool',
  'billiard',
  'projector',
  'wifi',
  'tv'
];

export const AMENITY_ICONS: Record<Amenity, { icon: string; label: string }> = {
  pet_friendly: {
    icon: 'pets',
    label: 'Pet Friendly'
  },
  barbecue: {
    icon: 'outdoor_grill',
    label: 'Barbacoa'
  },
  pool: {
    icon: 'pool',
    label: 'Piscina'
  },
  billiard: {
    icon: 'sports_bar',
    label: 'Billar'
  },
  projector: {
    icon: 'videocam',
    label: 'Proyector'
  },
  wifi: {
    icon: 'wifi',
    label: 'Wi-Fi'
  },
  tv: {
    icon: 'tv',
    label: 'TV / Pantalla'
  }
};