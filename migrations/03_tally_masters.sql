-- Create Groups table
CREATE TABLE IF NOT EXISTS "groups" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text NOT NULL UNIQUE,
    "parent_group" text,
    "created_at" timestamp DEFAULT now()
);

-- Create Import Metadata table to track project status
CREATE TABLE IF NOT EXISTS "import_meta" (
    "key" text PRIMARY KEY,
    "value" boolean DEFAULT false,
    "last_updated" timestamp DEFAULT now()
);

-- Initialize first_import_done flag
INSERT INTO "import_meta" (key, value) VALUES ('first_import_done', false) ON CONFLICT (key) DO NOTHING;

-- Enable RLS (though not strictly necessary if handled by service role, good practice)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_meta ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY admin_all_groups ON groups FOR ALL USING ( (auth.jwt() ->> 'role' = 'admin') );
CREATE POLICY admin_all_import_meta ON import_meta FOR ALL USING ( (auth.jwt() ->> 'role' = 'admin') );
