import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
// These will be available after the user sets up the project env vars
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lmsjblphqjvhamkkwuto.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_-eJMzalTVGIQyhYzkngjaw_RtW2qpX4";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
