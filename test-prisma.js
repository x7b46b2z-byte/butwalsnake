const { PrismaClient } = require('./prisma/generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

try {
  console.log('Testing PrismaClient with better-sqlite3 adapter...');
  const sqlite = new Database('./prisma/dev.db');
  const adapter = new PrismaBetterSqlite3(sqlite);
  const prisma = new PrismaClient({ adapter });
  console.log('PrismaClient instantiated successfully!');
  
  // Test query
  prisma.user.findMany().then(users => {
    console.log('Successfully queried users count:', users.length);
    console.log('User roles found:', users.map(u => `${u.name} (${u.role})`));
  }).catch(e => {
    console.error('Failed to query:', e);
  });
} catch (e) {
  console.error('Failed to instantiate PrismaClient:', e);
}
