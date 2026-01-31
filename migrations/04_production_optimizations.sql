-- Optimize Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_ledger_voucher_no ON ledger(voucher_no);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_bills_bill_no ON bills(bill_no);
CREATE INDEX IF NOT EXISTS idx_payments_reference_no ON payments(reference_no);
CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);
CREATE INDEX IF NOT EXISTS idx_groups_parent ON groups(parent_group);

-- Import Logs Table for production debugging
CREATE TABLE IF NOT EXISTS "import_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "session_id" uuid NOT NULL,
    "import_type" text NOT NULL, -- 'MASTER' or 'VOUCHER'
    "status" text NOT NULL, -- 'SUCCESS', 'PARTIAL', 'FAILED'
    "total_rows" int DEFAULT 0,
    "processed_rows" int DEFAULT 0,
    "error_summary" text,
    "created_at" timestamp DEFAULT now()
);

-- Enable RLS for logs
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_all_import_logs ON import_logs FOR ALL USING ( (auth.jwt() ->> 'role' = 'admin') );
