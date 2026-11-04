export type SpaceCategory = 'birthday_family' | 'kids_area' | 'outdoor_patio' | 'friends_gathering';

export const SPACE_CATEGORIES: SpaceCategory[] = [
  'birthday_family',
  'kids_area',
  'outdoor_patio',
  'friends_gathering',
];

export const SPACE_CATEGORY_CARDS: { id: SpaceCategory; label: string; image: string }[] = [
{ id: 'birthday_family', label: 'Cumpleaños', image: 'images/categories/cumpleanos.jpeg' },
{ id: 'kids_area', label: 'Zona infantil', image: 'images/categories/area-infantil.jpeg' },
{ id: 'outdoor_patio', label: 'Exterior', image: 'images/categories/patio.jpeg' },
{ id: 'friends_gathering', label: 'Reuniones Amigos', image: 'images/categories/grupo-amigo.jpeg' },
];