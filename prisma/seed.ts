import { PrismaClient } from './generated/prisma/client/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seeding...');

  // 1. Clear existing database entries
  await prisma.user.deleteMany({});
  await prisma.rescueRequest.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.snakeSpecies.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.galleryItem.deleteMany({});

  console.log('Existing data cleared.');

  // 2. Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin12345', salt);
  const coordinatorPassword = await bcrypt.hash('coordinator12345', salt);

  // 3. Create Staff Users
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@butwalsnakerescue.org',
      password: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  const coordinator = await prisma.user.create({
    data: {
      email: 'coordinator@butwalsnakerescue.org',
      password: coordinatorPassword,
      name: 'Devendra Sharma',
      role: 'RESCUE_COORDINATOR',
    },
  });

  console.log('Seeded administrative users.');

  // 4. Create Snake Species
  const species = [
    {
      name: 'Indian Cobra',
      scientificName: 'Naja naja',
      nepaliName: 'Gokhara Sarp (गोखरा सर्प)',
      venomous: true,
      habitat: 'Agricultural lands, rice paddies, forests, and human settlements around Rupandehi.',
      identificationGuide: 'Spectacled hood pattern on the dorsal side when threatened. Color ranges from yellow, brown, to charcoal black.',
      behavior: 'Mainly active during twilight or night. When threatened, raises front part of its body and spreads its hood while making sharp hissing sounds.',
      safetyTips: 'Do not approach or attempt to handle. Keep a distance of at least 15 feet. Keep your compound clear of trash and firewood pile.',
      emergencyAdvice: 'In case of bite: Stay absolutely calm, immobilize the bitten limb using a splint, and immediately transport the patient to Lumbini Provincial Hospital, Butwal.',
      imageUrl: 'https://images.unsplash.com/photo-1619472918844-3c6f1d244983?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Common Krait',
      scientificName: 'Bungarus caeruleus',
      nepaliName: 'Karait Sarp (करैत सर्प)',
      venomous: true,
      habitat: 'Fields, low scrub jungles, and inside houses under piles, cupboards, or beds.',
      identificationGuide: 'Dark blue-black body with narrow white cross-bands that starting halfway down the body. Scales are hexagonal along the spine.',
      behavior: 'Extremely nocturnal. Active only at night, hiding in burrows during the day. Generally non-aggressive during daylight but highly active and dangerous at night.',
      safetyTips: 'Always use a flashlight when walking at night. Sleep under a tucked-in mosquito net, even if sleeping on a bed. Avoid sleeping on the floor.',
      emergencyAdvice: 'Bites are often painless and occur during sleep, showing minimal local swelling. If suspected, seek urgent antivenom therapy immediately.',
      imageUrl: 'https://images.unsplash.com/photo-1531386151447-fd762e7872b7?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Oriental Rat Snake',
      scientificName: 'Ptyas mucosa',
      nepaliName: 'Dhaman Sarp (धामन सर्प)',
      venomous: false,
      habitat: 'Agricultural areas, wetlands, urban gardens, and rooftops chasing rodents.',
      identificationGuide: 'Long, slender body, pale brown or olive green with darker cross-bars on the posterior body. Large eyes with round pupils.',
      behavior: 'Fast-moving, diurnal snake. Feeds primarily on frogs, rodents, and lizards. If cornered, it can inflate its neck and make a growling sound.',
      safetyTips: 'Highly beneficial snake that controls rodent populations. They will try to flee when encountered. Do not harm them.',
      emergencyAdvice: 'If bitten, clean the wound thoroughly with soap and water to prevent secondary infection. No antivenom is required.',
      imageUrl: 'https://images.unsplash.com/photo-1579957092441-83a96beb4db2?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Checkered Keelback',
      scientificName: 'Fowlea piscator',
      nepaliName: 'Pani Sarp (पानी सर्प)',
      venomous: false,
      habitat: 'Lakes, ponds, rivers, irrigation canals, and flooded fields in Rupandehi.',
      identificationGuide: 'Olive-brown, yellow or gray body with black spots arranged in a checkerboard pattern. Two black stripes behind the eyes.',
      behavior: 'Very active during day and night, lives close to fresh water. Extremely aggressive when cornered, flattening its body and striking rapidly.',
      safetyTips: 'Often mistaken for venomous snakes due to aggressive posturing. Let them slide into nearby water channels.',
      emergencyAdvice: 'Bite is non-venomous but can bleed profusely due to anticoagulant properties of their saliva. Clean with antiseptic and soap.',
      imageUrl: 'https://images.unsplash.com/photo-1544983359-251f284a0c5c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  for (const s of species) {
    await prisma.snakeSpecies.create({ data: s });
  }
  console.log('Seeded snake species.');

  // 5. Create Active Volunteers
  const volunteers = [
    {
      name: 'Sushil Thapa',
      address: 'Milanchowk, Ward 8',
      municipality: 'Butwal',
      contact: '9847055112',
      experience: 'Advanced',
      vehicle: 'Motorcycle',
      availableTime: '24/7 Available',
      skills: 'Venomous snake handling, safety workshops coordinator',
      emergencyAvailability: 'Yes',
      status: 'APPROVED',
      assignedZone: 'Butwal Zone A',
    },
    {
      name: 'Pratima Rijal',
      address: 'Drivertole, Ward 3',
      municipality: 'Tilottama',
      contact: '9815042691',
      experience: 'Intermediate',
      vehicle: 'Car',
      availableTime: 'Evenings and Weekends',
      skills: 'Non-venomous rescue support, public first aid trainer',
      emergencyAvailability: 'Yes',
      status: 'APPROVED',
      assignedZone: 'Tilottama North',
    },
    {
      name: 'Rohan Chaudhary',
      address: 'Bhairahawa Bazar, Ward 5',
      municipality: 'Siddharthanagar',
      contact: '9867022441',
      experience: 'Beginner',
      vehicle: 'Motorcycle',
      availableTime: 'Flexible mornings',
      skills: 'Wildlife release assistant, community outreach helper',
      emergencyAvailability: 'No',
      status: 'PENDING',
    },
  ];

  for (const v of volunteers) {
    await prisma.volunteer.create({ data: v });
  }
  console.log('Seeded volunteers.');

  // 6. Create Blog Posts
  const blogs = [
    {
      title: 'Monsoon Alert: Why Snake Encounters Increase in Rupandehi',
      slug: 'monsoon-alert-snake-encounters-rupandehi',
      content: 'During the monsoon season, heavy rainfall floods the natural underground burrows of snakes, forcing them to seek high, dry grounds. In Rupandehi District, where wetlands and warm temperatures form a perfect snake habitat, this season marks a peak in snake encounters. Rice paddies become active hunting fields for cobras, while kraits seek shelter inside traditional mud houses or firewood stacks. Homeowners are advised to keep their compound clean, avoid walking in the dark without light, and immediately contact Butwal Snake Rescuers if a snake is spotted.',
      category: 'Monsoon',
      author: 'Devendra Sharma',
      tags: 'monsoon,safety,alert,rupandehi',
      status: 'PUBLISHED',
    },
    {
      title: 'Debunking the Myth of "Nagmani" and Snake Gems in Nepal',
      slug: 'debunking-nagmani-snake-gems-nepal',
      content: 'For centuries, traditional local folklore and cinematic portrayals have popularized the myth of "Nagmani" — a precious glowing gem located inside the head of ancient cobras. Scientifically, this is entirely false. Snakes are reptiles whose skeletal structures possess no mechanism to form or store gems. This myth, however, has led to the senseless killing of thousands of spectacled cobras by poachers and treasure hunters. Respecting local biodiversity means letting go of these dangerous myths and recognizing snakes as crucial rodent-control agents.',
      category: 'Myths',
      author: 'Super Admin',
      tags: 'myths,education,conservation,cobra',
      status: 'PUBLISHED',
    },
  ];

  for (const b of blogs) {
    await prisma.blogPost.create({ data: b });
  }
  console.log('Seeded blog posts.');

  // 7. Create Rescue Requests
  const rescues = [
    {
      name: 'Ram Prasad Neupane',
      phone: '9857041234',
      municipality: 'Butwal',
      address: 'Golpark, near Deurali temple',
      lat: 27.7082,
      lng: 83.4651,
      stillPresent: 'Yes',
      notes: 'Huge cobra spotted in the cattle shed. We have closed the door but are extremely panicked.',
      status: 'PENDING',
      priority: 'EMERGENCY',
    },
    {
      name: 'Geeta Kumari Shrestha',
      phone: '9806471928',
      municipality: 'Tilottama',
      address: 'Yogikuti, behind Sunrise Bank',
      lat: 27.6745,
      lng: 83.4682,
      stillPresent: 'Yes',
      notes: 'Green-colored snake hanging on the garden compound wall. Looks small but active.',
      status: 'ASSIGNED',
      priority: 'MEDIUM',
      assignedToId: 'vol-1',
      assignedToName: 'Sushil Thapa',
    },
    {
      name: 'Bimal Thapa',
      phone: '9847118833',
      municipality: 'Devdaha',
      address: 'Khaireni chowk',
      lat: 27.6698,
      lng: 83.5684,
      stillPresent: 'No',
      notes: 'Rat snake entered the kitchen drawer, ate a frog, and crawled out into the backyard bush.',
      status: 'CLOSED',
      priority: 'LOW',
      rescueNotes: 'Arrived within 25 minutes. Conducted search of the compound. Confirmed rat snake had escaped into deep bushes. Delivered safety tips to the homeowner.',
    },
  ];

  for (const r of rescues) {
    await prisma.rescueRequest.create({ data: r });
  }
  console.log('Seeded rescue requests.');

  // 8. Create Gallery Items
  const gallery = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1544983359-251f284a0c5c?auto=format&fit=crop&q=80&w=800',
      caption: 'Safe rescue of a spectacled cobra from a store room in Milanchowk, Butwal.',
      category: 'RESCUE',
      location: 'Butwal-8',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1579957092441-83a96beb4db2?auto=format&fit=crop&q=80&w=800',
      caption: 'Release of a mature Oriental Rat snake back into the nearby community forest.',
      category: 'RELEASE',
      location: 'Devdaha Forest',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
      caption: 'Wildlife and snake conservation school awareness program at Butwal Kalika School.',
      category: 'AWARENESS',
      location: 'Butwal Kalika',
    },
  ];

  for (const g of gallery) {
    await prisma.galleryItem.create({ data: g });
  }
  console.log('Seeded gallery items.');

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seed execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
