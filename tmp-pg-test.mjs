import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;
(async () => {
  try {
    const client = new Client({
      host: 'rocpampugigfcnifigbv.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    console.log('connected');
    const res = await client.query("SELECT 1 as ok");
    console.log(JSON.stringify(res.rows));
    await client.end();
    console.log('done');
  } catch (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
})();
