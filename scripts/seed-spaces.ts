import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const HOST_ID = 'JFhmspGPHFPShZVxidCqTTFvM5M2';

const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, 'clave-privada-firebase.json'), 'utf-8'),
) as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

const barcelona = {
  city: 'Barcelona',
  province: 'Barcelona',
  autonomousCommunity: 'Cataluña',
};

const neighborhoods = [
  { name: 'Barceloneta', zipCode: '08003', lat: 41.376, lon: 2.189, street: "Carrer de l'Almirall Cervera" },
  { name: 'El Born', zipCode: '08003', lat: 41.385, lon: 2.183, street: 'Carrer dels Carders' },
  { name: 'El Raval', zipCode: '08001', lat: 41.38, lon: 2.17, street: 'Carrer del Carme' },
  { name: 'Eixample', zipCode: '08006', lat: 41.394, lon: 2.158, street: 'Carrer de Balmes' },
  { name: 'Gràcia', zipCode: '08012', lat: 41.4095, lon: 2.1554, street: 'Carrer de Verdi' },
  { name: 'Horta', zipCode: '08031', lat: 41.43, lon: 2.16, street: 'Carrer del Tajo' },
  { name: 'Les Corts', zipCode: '08029', lat: 41.386, lon: 2.131, street: 'Carrer de Numància' },
  { name: 'Poblenou', zipCode: '08005', lat: 41.397, lon: 2.2, street: 'Carrer de Pujades' },
  { name: 'Sant Andreu', zipCode: '08030', lat: 41.435, lon: 2.191, street: 'Carrer Gran de Sant Andreu' },
  { name: 'Sant Martí', zipCode: '08005', lat: 41.405, lon: 2.19, street: 'Carrer de Bilbao' },
  { name: 'Sants', zipCode: '08014', lat: 41.375, lon: 2.136, street: 'Carrer de Sants' },
  { name: 'Sarrià', zipCode: '08017', lat: 41.3975, lon: 2.122, street: 'Carrer Major de Sarrià' },
];

const types = [
  { prefix: 'Patio', categories: ['outdoor_patio', 'birthday_family'], amenities: ['barbecue', 'wifi', 'pet_friendly'] },
  { prefix: 'Loft', categories: ['friends_gathering', 'birthday_family'], amenities: ['wifi', 'projector', 'tv'] },
  { prefix: 'Terraza', categories: ['outdoor_patio', 'friends_gathering'], amenities: ['wifi', 'barbecue', 'tv'] },
  { prefix: 'Local', categories: ['friends_gathering', 'birthday_family'], amenities: ['wifi', 'projector', 'pet_friendly'] },
  { prefix: 'Nave', categories: ['friends_gathering'], amenities: ['wifi', 'projector', 'billiard'] },
  { prefix: 'Jardín', categories: ['kids_area', 'outdoor_patio', 'birthday_family'], amenities: ['pool', 'barbecue', 'pet_friendly', 'wifi'] },
  { prefix: 'Casa', categories: ['kids_area', 'birthday_family'], amenities: ['pool', 'wifi', 'tv', 'pet_friendly'] },
  { prefix: 'Ático', categories: ['outdoor_patio', 'friends_gathering'], amenities: ['wifi', 'barbecue', 'tv'] },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-2495db98dada?w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1517502884422-41e157d25225?w=800&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
];

const REASONS = [
  'Falta el certificado de habitabilidad.',
  'Las fotos no muestran el espacio con claridad.',
  'El aforo declarado no coincide con los metros cuadrados.',
];

function createdAt(daysAgo: number): Timestamp {
  const date = new Date('2026-09-02T21:15:06Z');
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return Timestamp.fromDate(date);
}

function pickImages(index: number): string[] {
  return Array.from({ length: 7 }, (_, i) => IMAGES[(index + i) % IMAGES.length]);
}

function statusFor(index: number) {
  if (index < 32) return { publicationStatus: 'published' as const };
  if (index < 40) return { publicationStatus: 'pending_approval' as const };
  if (index < 46) {
    return {
      publicationStatus: 'rejected' as const,
      rejectionReason: REASONS[index % REASONS.length],
    };
  }
  return { publicationStatus: 'deactivated' as const };
}

const seedSpaces = Array.from({ length: 50 }, (_, index) => {
  const zone = neighborhoods[index % neighborhoods.length];
  const type = types[index % types.length];
  const number = Math.floor(index / neighborhoods.length) + 1;
  const status = statusFor(index);

  return {
    name: `${type.prefix} ${zone.name}${number > 1 ? ` ${number}` : ''}`,
    description: `${type.prefix} en ${zone.name}, Barcelona. Espacio para celebraciones, reuniones y eventos de grupo.`,
    dailyPrice: 55 + (index % 12) * 10,
    location: {
      ...barcelona,
      fullAddress: `${zone.street}, ${10 + index}, ${zone.name}, Barcelona`,
      neighborhood: zone.name,
      zipCode: zone.zipCode,
      lat: zone.lat + (index % 5) * 0.001,
      lon: zone.lon + (index % 5) * 0.001,
    },
    squareMeters: 40 + (index % 16) * 10,
    capacity: 12 + (index % 10) * 4,
    categories: type.categories,
    amenities: type.amenities,
    blockedDates: index % 3 === 0 ? [`2026-09-${String(10 + (index % 18)).padStart(2, '0')}`] : [],
    images: pickImages(index),
    hostId: HOST_ID,
    createdAt: createdAt(index),
    ...status,
  };
});

async function seed() {
  const collectionRef = db.collection('spaces');

  console.log('🧹 Eliminando espacios existentes...');
  const existing = await collectionRef.get();
  const docs = existing.docs;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    docs.slice(i, i + 400).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  console.log(`🗑️  Eliminados ${existing.size} espacios.`);

  console.log('🌱 Insertando 50 espacios del host Erick...');
  for (let i = 0; i < seedSpaces.length; i += 400) {
    const batch = db.batch();
    seedSpaces.slice(i, i + 400).forEach((space) => {
      batch.set(collectionRef.doc(), space);
    });
    await batch.commit();
  }
  console.log(`✅ Se insertaron ${seedSpaces.length} espacios (hostId=${HOST_ID}).`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error al insertar seed data:', error);
    process.exit(1);
  });