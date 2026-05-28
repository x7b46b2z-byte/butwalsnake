import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or key.');
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false }, global: { fetch } });
const candidates = ['imageUrl','image_url','image','featured_image_url','featuredImageUrl','thumbnail_url','thumbnailUrl','createdAt','created_at','id','slug','category','author','tags','status','content'];
(async () => {
  for (const c of candidates) {
    try {
      const res = await db.from('BlogPost').select(c).limit(1);
      console.log(c, JSON.stringify(res, null, 2));
    } catch (e) {
      console.error(c, 'ERROR', e.message || e);
    }
  }

  const allRes = await db.from('BlogPost').select('*').limit(1);
  console.log('*', JSON.stringify(allRes, null, 2));
})();
