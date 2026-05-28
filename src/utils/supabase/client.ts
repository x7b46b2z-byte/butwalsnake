import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase browser environment variables are missing. Define NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or SUPABASE_ANON_KEY.'
  );
}

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
