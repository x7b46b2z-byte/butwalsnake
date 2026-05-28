import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false }, global: { fetch } });

async function addImageColumn() {
  try {
    console.log('📝 Adding image_url column to BlogPost table...');

    // Use RPC or direct query through Supabase
    const { data, error } = await db.rpc('exec_sql', {
      sql: `
        ALTER TABLE "BlogPost" 
        ADD COLUMN IF NOT EXISTS image_url TEXT;
      `
    }).catch(async (err) => {
      // If RPC doesn't exist, try using the query builder with raw SQL
      console.log('⚠️  RPC exec_sql not available, trying alternative approach...');
      
      // Try a different approach - update via SQL through the query
      const result = await db.from('BlogPost').select('id').limit(1);
      if (result.error) {
        return { error: result.error };
      }
      
      // If we can read, we might not have direct SQL access
      // So we'll just note what needs to be done
      return { data: null, error: { message: 'Direct SQL execution not available through Supabase JS client' } };
    });

    if (error && error.message.includes('Direct SQL execution')) {
      console.log('⚠️  Could not execute SQL directly via Supabase client.');
      console.log('📋 Please run this SQL in Supabase SQL Editor manually:');
      console.log('');
      console.log('ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS image_url TEXT;');
      console.log('');
      console.log('Then run: node verify-schema.mjs');
      return;
    }

    if (error) {
      console.error('❌ Error:', error.message || error);
      process.exit(1);
    }

    console.log('✅ Column added successfully!');

    // Verify the column exists
    const verifyRes = await db.from('BlogPost').select('image_url').limit(1);
    if (verifyRes.error) {
      console.error('❌ Column verification failed:', verifyRes.error.message);
      process.exit(1);
    }

    console.log('✅ Column verified - image_url is now available in BlogPost table');
  } catch (e) {
    console.error('❌ Exception:', e.message || e);
    process.exit(1);
  }
}

addImageColumn();
