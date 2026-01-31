-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts if re-run
DROP POLICY IF EXISTS "Users can view own profile" ON customers;
DROP POLICY IF EXISTS "Users can view own ledger" ON ledger;
DROP POLICY IF EXISTS "Users can view own bills" ON bills;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;

-- Customers
-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT
  USING (auth.uid() = id);

-- Ledger
CREATE POLICY "Users can view own ledger" ON ledger
  FOR SELECT
  USING (customer_id = auth.uid());

-- Bills
CREATE POLICY "Users can view own bills" ON bills
  FOR SELECT
  USING (customer_id = auth.uid());

-- Payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (customer_id = auth.uid());
