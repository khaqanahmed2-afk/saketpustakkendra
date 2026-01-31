/**
 * @deprecated DANGEROUS: DO NOT USE FOR DATA FETCHING.
 * 
 * We have moved to a Backend-for-Frontend (BFF) architecture to secure data access.
 * The Supabase Anon Key is NOT sufficient for securing data with our custom auth scheme.
 * 
 * ALL data fetching must go through /api/* endpoints which verify the session.
 * 
 * This client should only be used if we implement Supabase Auth (e.g. Phone Auth) in the future.
 */

import { createClient } from "@supabase/supabase-js";

// Placeholder to prevent build errors in legacy code, but runtime usage will warn.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
