import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase environment variables are missing. Define SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
  );
}

export const db = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch },
});
