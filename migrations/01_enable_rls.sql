-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- CUSTOMERS POLICIES
-- --------------------------------------------------------

-- Admin: Can do everything
CREATE POLICY admin_all_customers ON customers
    FOR ALL
    USING ( (auth.jwt() ->> 'role' = 'admin') );

-- Users: Can view their own profile
CREATE POLICY user_view_self ON customers
    FOR SELECT
    USING ( (id = auth.uid()) );

-- Users: Can update their own PIN
CREATE POLICY user_update_self_pin ON customers
    FOR UPDATE
    USING ( (id = auth.uid()) );

-- --------------------------------------------------------
-- LEDGER POLICIES
-- --------------------------------------------------------

-- Admin: Can do everything
CREATE POLICY admin_all_ledger ON ledger
    FOR ALL
    USING ( (auth.jwt() ->> 'role' = 'admin') );

-- Users: Can view their own transactions
CREATE POLICY user_view_ledger ON ledger
    FOR SELECT
    USING ( (customer_id = auth.uid()) );

-- --------------------------------------------------------
-- BILLS POLICIES
-- --------------------------------------------------------

-- Admin: Can do everything
CREATE POLICY admin_all_bills ON bills
    FOR ALL
    USING ( (auth.jwt() ->> 'role' = 'admin') );

-- Users: Can view their own bills
CREATE POLICY user_view_bills ON bills
    FOR SELECT
    USING ( (customer_id = auth.uid()) );

-- --------------------------------------------------------
-- PAYMENTS POLICIES
-- --------------------------------------------------------

-- Admin: Can do everything
CREATE POLICY admin_all_payments ON payments
    FOR ALL
    USING ( (auth.jwt() ->> 'role' = 'admin') );

-- Users: Can view their own payments
CREATE POLICY user_view_payments ON payments
    FOR SELECT
    USING ( (customer_id = auth.uid()) );
