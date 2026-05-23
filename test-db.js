// Full database connection and table check
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 8000,
});

async function main() {
  console.log('🔌 Testing connection to:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'));
  
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!\n');

    // Check which tables exist
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables found in database:');
    if (tables.rows.length === 0) {
      console.log('  ❌ NO TABLES FOUND - You need to run the SQL from the chat!');
    } else {
      tables.rows.forEach(r => console.log('  ✅', r.table_name));
    }

    // Check user count
    try {
      const users = await client.query('SELECT id, email, role FROM "User"');
      console.log(`\n👤 Admin Users (${users.rows.length}):`);
      users.rows.forEach(u => console.log(`  - ${u.email} [${u.role}]`));
      if (users.rows.length === 0) {
        console.log('  ❌ No admin users found — SQL insert failed or not run yet!');
      }
    } catch(e) {
      console.log('  ❌ User table missing or error:', e.message);
    }

    client.release();
  } catch (err) {
    console.log('❌ Connection FAILED:', err.message);
    if (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')) {
      console.log('\n💡 FIX: Your DATABASE_URL uses port 5432 which Supabase blocks on free tier.');
      console.log('   Go to Supabase → Settings → Database → Connection String');
      console.log('   Enable "Use connection pooling" (Transaction mode, port 6543)');
      console.log('   Replace your DATABASE_URL with the pooler URL.');
    }
    if (err.message.includes('password') || err.message.includes('authentication')) {
      console.log('\n💡 FIX: Wrong password. Reset it in Supabase → Settings → Database → Reset Password');
    }
  }

  await pool.end();
}

main();
