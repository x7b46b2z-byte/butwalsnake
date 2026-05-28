import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Missing SUPABASE_URL or key environment variables');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false }, global: { fetch } });

async function verifySchema() {
  try {
    console.log('🔍 Checking BlogPost table schema...\n');

    const candidateColumns = [
      'image_url',
      'imageUrl', 
      'featured_image_url',
      'image',
      'thumbnail_url',
      'thumbnailUrl'
    ];

    let imageColumnFound = null;

    for (const col of candidateColumns) {
      try {
        const { data, error } = await db.from('BlogPost').select(col).limit(1);
        if (!error) {
          imageColumnFound = col;
          console.log(`✅ Found image column: "${col}"`);
          break;
        }
      } catch (e) {
        // Column doesn't exist, continue
      }
    }

    if (!imageColumnFound) {
      console.log('❌ No image column found in BlogPost table');
      console.log('\n📋 To fix this, go to Supabase Dashboard and run this SQL:');
      console.log('\n--- Copy and paste in Supabase SQL Editor ---');
      console.log(`ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS image_url TEXT;`);
      console.log('--- End ---\n');
      console.log('After running the SQL above, featured images will work!\n');
      return false;
    }

    return true;
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

verifySchema().then(ok => {
  if (ok) {
    console.log('✨ BlogPost schema is ready for featured images!');
  }
});
