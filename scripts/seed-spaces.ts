import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, 'clave-privada-firebase.json'), 'utf-8')
) as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const seedSpaces = [
  {
    name: 'Patio Gràcia',
    description:
      'Un patio encantador en el corazón de Gràcia, perfecto para cumpleaños, reuniones familiares y barbacoas entre amigos. Lleno de luz natural y plantas.',
    dailyPrice: 75,
    location: {
      fullAddress: 'Carrer de Verdi, 25, Gràcia, Barcelona',
      neighborhood: 'Gràcia',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08012',
      lat: 41.4095,
      lon: 2.1554,
    },
    squareMeters: 60,
    capacity: 25,
    categories: ['birthday_family', 'friends_gathering'],
    amenities: ['pet_friendly', 'barbecue', 'wifi'],
    blockedDates: ['2026-08-15', '2026-08-16', '2026-08-22'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-2495db98dada?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    hostId: 'host_001',
    publicationStatus: 'published',
  },
  {
    name: 'Local Born',
    description:
      'Local acogedor en el Born ideal para reuniones de amigos, cumpleaños y pequeños eventos. Ambiente cálido con decoración de barrio.',
    dailyPrice: 95,
    location: {
      fullAddress: 'Carrer dels Carders, 12, El Born, Barcelona',
      neighborhood: 'El Born',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08003',
      lat: 41.385,
      lon: 2.183,
    },
    squareMeters: 80,
    capacity: 35,
    categories: ['friends_gathering', 'birthday_family'],
    amenities: ['wifi', 'projector', 'pet_friendly'],
    blockedDates: ['2026-08-10', '2026-08-17'],
    images: [
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    ],
    hostId: 'host_002',
    publicationStatus: 'published',
  },
  {
    name: 'Nave Poblenou',
    description:
      'Amplia nave industrial reformada en Poblenou. Perfecta para fiestas de cumpleaños, reuniones de amigos y eventos creativos.',
    dailyPrice: 140,
    location: {
      fullAddress: 'Carrer de Pujades, 85, Poblenou, Barcelona',
      neighborhood: 'Poblenou',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08005',
      lat: 41.397,
      lon: 2.2,
    },
    squareMeters: 180,
    capacity: 50,
    categories: ['friends_gathering', 'birthday_family'],
    amenities: ['wifi', 'projector', 'billiard', 'parking'],
    blockedDates: ['2026-08-08', '2026-08-09', '2026-08-29'],
    images: [
      'https://images.unsplash.com/photo-1517502884422-41e157d25225?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    ],
    hostId: 'host_003',
    publicationStatus: 'published',
  },
  {
    name: 'Jardín Sarrià',
    description:
      'Jardín privado con piscina en Sarrià. Ideal para celebraciones familiares, cumpleaños con niños y barbacoas en verano.',
    dailyPrice: 150,
    location: {
      fullAddress: 'Carrer Major de Sarrià, 44, Sarrià, Barcelona',
      neighborhood: 'Sarrià',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08017',
      lat: 41.3975,
      lon: 2.122,
    },
    squareMeters: 200,
    capacity: 40,
    categories: ['kids_area', 'birthday_family', 'outdoor_patio'],
    amenities: ['pool', 'barbecue', 'pet_friendly', 'wifi'],
    blockedDates: ['2026-08-01', '2026-08-02'],
    images: [
      'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    hostId: 'host_004',
    publicationStatus: 'published',
  },
  {
    name: 'Terraza Eixample',
    description:
      'Gran terraza en el Eixample con vistas a la ciudad. Perfecta para reuniones de amigos y eventos al aire libre.',
    dailyPrice: 110,
    location: {
      fullAddress: 'Carrer de Balmes, 201, Eixample, Barcelona',
      neighborhood: 'Eixample',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08006',
      lat: 41.394,
      lon: 2.158,
    },
    squareMeters: 90,
    capacity: 30,
    categories: ['outdoor_patio', 'friends_gathering'],
    amenities: ['wifi', 'barbecue', 'projector'],
    blockedDates: ['2026-08-12', '2026-08-19'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    hostId: 'host_005',
    publicationStatus: 'published',
  },
  {
    name: 'Loft Raval',
    description:
      'Loft moderno y versátil en el Raval. Ideal para reuniones íntimas, cumpleaños y pequeños eventos culturales.',
    dailyPrice: 65,
    location: {
      fullAddress: 'Carrer del Carme, 33, El Raval, Barcelona',
      neighborhood: 'El Raval',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08001',
      lat: 41.38,
      lon: 2.17,
    },
    squareMeters: 55,
    capacity: 20,
    categories: ['friends_gathering', 'birthday_family'],
    amenities: ['wifi', 'projector', 'pet_friendly'],
    blockedDates: ['2026-08-05', '2026-08-06'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    hostId: 'host_006',
    publicationStatus: 'published',
  },
  {
    name: 'Casa con jardín Horta',
    description:
      'Casa familiar con amplio jardín en Horta. Perfecta para cumpleaños infantiles, reuniones familiares y disfrutar al aire libre.',
    dailyPrice: 85,
    location: {
      fullAddress: 'Carrer del Tajo, 12, Horta, Barcelona',
      neighborhood: 'Horta',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08031',
      lat: 41.43,
      lon: 2.16,
    },
    squareMeters: 150,
    capacity: 35,
    categories: ['kids_area', 'birthday_family', 'outdoor_patio'],
    amenities: ['pool', 'barbecue', 'pet_friendly', 'parking', 'wifi'],
    blockedDates: ['2026-08-14', '2026-08-21'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&q=80',
    ],
    hostId: 'host_007',
    publicationStatus: 'published',
  },
  {
    name: 'Espacio industrial Sant Martí',
    description:
      'Espacio industrial diáfano en Sant Martí. Ideal para reuniones de amigos, fiestas de cumpleaños y eventos creativos.',
    dailyPrice: 120,
    location: {
      fullAddress: 'Carrer de Bilbao, 56, Sant Martí, Barcelona',
      neighborhood: 'Sant Martí',
      city: 'Barcelona',
      province: 'Barcelona',
      autonomousCommunity: 'Cataluña',
      zipCode: '08005',
      lat: 41.405,
      lon: 2.19,
    },
    squareMeters: 160,
    capacity: 45,
    categories: ['friends_gathering', 'birthday_family'],
    amenities: ['wifi', 'projector', 'billiard', 'parking'],
    blockedDates: ['2026-08-03', '2026-08-11', '2026-08-18'],
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80',
    ],
    hostId: 'host_008',
    publicationStatus: 'published',
  },
];

async function seed() {
  const collectionRef = db.collection('spaces');

  console.log('🧹 Eliminando espacios existentes...');
  const existing = await collectionRef.get();
  const batchDelete = db.batch();
  existing.docs.forEach((doc) => batchDelete.delete(doc.ref));
  await batchDelete.commit();
  console.log(`🗑️  Eliminados ${existing.size} espacios.`);

  console.log('🌱 Insertando nuevos espacios...');
  const batchWrite = db.batch();

  for (const space of seedSpaces) {
    const docRef = collectionRef.doc();
    const now = new Date();
    const newSpace = {
      ...space,
      createdAt: now,
      requestedAt: now,
      approvedAt: now,
      approvedByAdminId: 'admin_001',
    };
    batchWrite.set(docRef, newSpace);
  }

  await batchWrite.commit();
  console.log(`✅ Se insertaron ${seedSpaces.length} espacios.`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error al insertar seed data:', error);
    process.exit(1);
  });
