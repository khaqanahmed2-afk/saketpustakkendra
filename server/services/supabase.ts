import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
    throw new Error("Missing SUPABASE_URL in environment variables.");
}

if (!supabaseKey) {
    throw new Error("Missing SUPABASE_SERVICE_KEY in environment variables. Please get this from your Supabase Dashboard -> Project Settings -> API.");
}

// The service_role key has admin privileges and bypasses RLS.
// This is perfect for backend tasks like data imports.
export const supabase = createClient(supabaseUrl, supabaseKey);

