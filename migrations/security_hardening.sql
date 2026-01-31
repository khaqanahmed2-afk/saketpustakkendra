-- Migration: Add role to customers and create session table
-- Run this in your Supabase SQL Editor

-- 1. Add Role Column
ALTER TABLE customers ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' NOT NULL;
ALTER TABLE customers ADD CONSTRAINT customers_role_check CHECK (role IN ('user', 'admin'));

-- 2. Create Session Table for connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- 3. ENABLE RLS (Security Hardening)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES (DENY ALL PUBLIC ACCESS)
-- Since we moved to a Backend-for-Frontend (BFF) pattern, the frontend
-- NO LONGER connects to Supabase directly. 
-- The Backend uses the SERVICE_ROLE_KEY which bypasses RLS.
-- Therefore, the safest policy for the "public" / "anon" role is to DENY everything.

CREATE POLICY "Deny Public Access Customers" ON customers FOR ALL USING (false);
CREATE POLICY "Deny Public Access Ledger" ON ledger FOR ALL USING (false);
CREATE POLICY "Deny Public Access Bills" ON bills FOR ALL USING (false);
CREATE POLICY "Deny Public Access Payments" ON payments FOR ALL USING (false);

-- NOTE: If you ever decide to go back to frontend access, you would enable:
-- CREATE POLICY "Users see own data" ON customers FOR SELECT USING (auth.uid() = id);
-- But this requires Supabase Auth integration which we are bypassing for Custom PIN compatibility.
