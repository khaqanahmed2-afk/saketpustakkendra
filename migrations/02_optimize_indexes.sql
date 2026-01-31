-- Database Performance Optimization Indexes
-- Optimize lookup for transactions, bills, and payments by customer

-- Index for customer mobile lookups (High usage during auth)
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);

-- Indexes for ledger entries (High volume, filtered by customer and date)
CREATE INDEX IF NOT EXISTS idx_ledger_customer_id ON ledger(customer_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entry_date ON ledger(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_voucher_no ON ledger(voucher_no);

-- Indexes for bills (Filtered by customer and date)
CREATE INDEX IF NOT EXISTS idx_bills_customer_id ON bills(customer_id);
CREATE INDEX IF NOT EXISTS idx_bills_bill_date ON bills(bill_date DESC);

-- Indexes for payments (Filtered by customer and date)
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date DESC);
