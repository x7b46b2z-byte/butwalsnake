const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const db = new PrismaClient();

async function main() {
  // Try to update existing admin user
  const updated = await db.user.updateMany({
    where: { email: 'admin@butwalsnakerescue.org' },
    data: {
      email: 'bsr_admin',
      password: '$2b$10$MjejdzUuoGLhUCaLjQmGc.3427ZE5R4GXVCerMYZS/0qgZByi1Ssu',
      name: 'BSR Admin'
    }
  });

  if (updated.count === 0) {
    // No old user found, try upsert
    const upserted = await db.user.upsert({
      where: { email: 'bsr_admin' },
      update: {
        password: '$2b$10$MjejdzUuoGLhUCaLjQmGc.3427ZE5R4GXVCerMYZS/0qgZByi1Ssu',
        name: 'BSR Admin'
      },
      create: {
        email: 'bsr_admin',
        password: '$2b$10$MjejdzUuoGLhUCaLjQmGc.3427ZE5R4GXVCerMYZS/0qgZByi1Ssu',
        name: 'BSR Admin',
        role: 'SUPER_ADMIN'
      }
    });
    console.log('Upserted admin user:', upserted.email);
  } else {
    console.log('Updated admin user count:', updated.count);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
