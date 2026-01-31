import { Request, Response } from "express";
import { supabase } from "../services/supabase";

export async function getDashboardData(req: Request, res: Response) {
    try {
        const customerId = req.session.user!.id;

        // Parallel Fetching for performance
        const [customerRes, ledgerRes, billsRes, paymentsRes, monthlyRes, invoicesRes] = await Promise.all([
            supabase.from("customers").select("*").eq("id", customerId).single(),
            supabase.from("ledger").select("*").eq("customer_id", customerId).order("entry_date", { ascending: false }).limit(500),
            supabase.from("bills").select("*").eq("customer_id", customerId).order("bill_date", { ascending: false }).limit(500),
            supabase.from("payments").select("*").eq("customer_id", customerId).order("payment_date", { ascending: false }).limit(500),
            supabase.from("monthly_ledger_summary").select("*").eq("customer_id", customerId).order("month", { ascending: true }),
            supabase.from("invoices").select("*, amount:total_amount").eq("customer_id", customerId).order("date", { ascending: false }).limit(500)
        ]);

        if (customerRes.error) throw customerRes.error;

        const ledger = ledgerRes.data || [];
        const bills = billsRes.data || [];
        const invoices = invoicesRes.data || [];
        const payments = paymentsRes.data || [];

        // Calculate totals manually to ensure accuracy across new tables
        // Safety Guards: ensure all values are treated as Numbers to prevent NaN
        const totalDetails = {
            bills: bills.reduce((sum: any, b: any) => sum + Number(b.amount || 0), 0),
            invoices: invoices.reduce((sum: any, i: any) => sum + Number(i.total_amount || i.amount || 0), 0),
            payments: payments.reduce((sum: any, p: any) => sum + Number(p.amount || 0), 0)
        };

        const totalPurchases = totalDetails.bills + totalDetails.invoices;
        const totalPaid = totalDetails.payments;

        // Closing Balance Calculation as per request: 
        // closing = opening_balance + totalPurchase - totalPaid
        // Assuming opening_balance is 0 for All-Time view calculated here, 
        // or derived from the latest ledger entry if available and reliable.
        // For consistency with the requested formula:
        const openingBalance = 0;
        const currentBalance = openingBalance + totalPurchases - totalPaid;

        res.json({
            customer: customerRes.data,
            ledger: ledger,
            bills: bills,
            payments: payments,
            monthly: monthlyRes.data || [],
            invoices: invoices,
            summary: {
                totalPurchases: totalPurchases,
                totalPaid: totalPaid,
                currentBalance: currentBalance,
            }
        });

    } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
}
