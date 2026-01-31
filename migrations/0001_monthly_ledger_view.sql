CREATE OR REPLACE VIEW monthly_ledger_summary AS
SELECT 
  customer_id,
  TO_CHAR(entry_date, 'YYYY-MM') as month,
  SUM(debit) as total_purchase,
  SUM(credit) as total_paid
FROM ledger
GROUP BY customer_id, TO_CHAR(entry_date, 'YYYY-MM');
