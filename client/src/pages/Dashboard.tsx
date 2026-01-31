import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useDashboardData } from "@/hooks/use-dashboard";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Wallet, ShoppingCart, Receipt, Calendar, Lock, LogOut, FileText, Download, TrendingUp, TrendingDown, ArrowUpRight, Search, Filter } from "lucide-react";
import { format, subMonths, startOfYear, endOfYear, isWithinInterval, parseISO } from "date-fns";
import { DashboardCharts } from "@/components/DashboardCharts";
import { LedgerTable } from "@/components/LedgerTable";
import { SkeletonLoader } from "@/components/LoadingStates";
import { motion, AnimatePresence } from "framer-motion";
import { AccountInfoCard } from "@/components/dashboard/AccountInfoCard";
import { generatePDFStatement, generateExcelStatement } from "@/utils/statement-generator";
import { ShinyButton } from "@/components/ui/shiny-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const { customer, ledger, bills, invoices, payments, summary, monthly, isLoading } = useDashboardData();

  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("yearly"); // Default to yearly for broader view
  const [invoiceSearch, setInvoiceSearch] = useState("");

  // Calculate Balances & Filter Data based on View Mode
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = startOfYear(now);
    let endDate = endOfYear(now);

    if (viewMode === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // fallback if ledger not available, use invoices/payments directly
    const hasLedger = ledger && ledger.length > 0;

    if (!hasLedger) {
      // Fallback Calculation from Invoices/Payments
      const validInvoices = (invoices || []).filter((inv: any) => {
        const d = new Date(inv.date || inv.billDate || inv.bill_date);
        return isWithinInterval(d, { start: startDate, end: endDate });
      });
      const validPayments = (payments || []).filter((pay: any) => {
        const d = new Date(pay.paymentDate || pay.payment_date);
        return isWithinInterval(d, { start: startDate, end: endDate });
      });

      const purchases = validInvoices.reduce((sum: number, inv: any) => sum + Number(inv.totalAmount || inv.total_amount || inv.amount || 0), 0);
      const paid = validPayments.reduce((sum: number, pay: any) => sum + Number(pay.amount || 0), 0);

      return {
        ledger: [],
        purchases,
        paid,
        opening: 0,
        closing: purchases - paid // simplified implies starting from 0 if no ledger
      };
    }

    // Main Ledger Calculation
    const filteredLedger = ledger.filter((item: any) => {
      const date = new Date(item.entryDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });

    // Opening Balance
    const lastPrevEntry = ledger.find((item: any) => new Date(item.entryDate) < startDate);
    const openingBalance = lastPrevEntry ? Number(lastPrevEntry.balance) : 0;

    const purchases = filteredLedger.reduce((sum: number, item: any) => sum + Number(item.debit || 0), 0);
    const paid = filteredLedger.reduce((sum: number, item: any) => sum + Number(item.credit || 0), 0);

    // Closing Balance Calculation (Strict Formula)
    const closingBalance = openingBalance + purchases - paid;

    return {
      ledger: filteredLedger,
      purchases,
      paid,
      opening: openingBalance,
      closing: closingBalance
    };
  }, [ledger, invoices, payments, viewMode]);

  // Invoice / Bill Merging Logic
  const displayInvoices = useMemo(() => {
    // Prefer 'invoices' table, allow search
    let data = (invoices && invoices.length > 0) ? invoices : (bills || []);

    // Filter
    if (invoiceSearch) {
      const term = invoiceSearch.trim().toLowerCase();
      data = data.filter((inv: any) => {
        // Safe Access: check all possible key variations
        const invNo = String(inv.invoiceNo ?? inv.invoice_no ?? inv.billNo ?? inv.bill_no ?? "").toLowerCase();
        const amt = String(inv.amount ?? inv.totalAmount ?? inv.total_amount ?? 0);

        return invNo.includes(term) || amt.includes(term);
      });
    }
    return data;
  }, [invoices, bills, invoiceSearch]);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <SkeletonLoader />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  // Invoice / Bill Merging Logic



  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen pb-20 overflow-x-hidden">

        {/* Top Header & Account Info - PASTEL THEME */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-10 pb-20 px-4 border-b border-primary/5">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold text-slate-800">
                  Welcome, <span className="text-primary">{customer?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 font-medium">Here is your financial overview.</p>
              </div>

              <div className="flex gap-3">
                <ShinyButton onClick={() => generatePDFStatement({
                  customer,
                  ledger: filteredData.ledger,
                  openingBalance: filteredData.opening,
                  closingBalance: filteredData.closing
                })} className="bg-white border-primary/20 text-slate-700 hover:bg-primary/5 shadow-sm">
                  <Download className="w-4 h-4 mr-2 text-primary" /> Statement (PDF)
                </ShinyButton>
                <ShinyButton onClick={() => generateExcelStatement({
                  customer,
                  ledger: filteredData.ledger,
                  openingBalance: filteredData.opening,
                  closingBalance: filteredData.closing
                })} className="bg-white border-primary/20 text-slate-700 hover:bg-primary/5 shadow-sm">
                  <FileText className="w-4 h-4 mr-2 text-green-600" /> Excel
                </ShinyButton>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left Sidebar: Account Info */}
            <div className="lg:col-span-1 space-y-6">
              <AccountInfoCard customer={customer} />

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <button onClick={() => setLocation("/change-pin")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors text-slate-600 font-medium text-sm border border-transparent hover:border-primary/10">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Change PIN</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </button>
                  <button onClick={() => signOut()} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors text-red-500 font-medium text-sm border border-transparent hover:border-red-100">
                    <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</span>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Right Content: Summary & Tabs */}
            <div className="lg:col-span-3 space-y-8">

              {/* View Toggle */}
              <div className="flex justify-end">
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-primary/10 inline-flex">
                  <button
                    onClick={() => setViewMode("monthly")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'monthly' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-secondary'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setViewMode("yearly")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'yearly' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-secondary'}`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="Opening Balance"
                  value={`₹${filteredData.opening.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  icon={Calendar}
                  color="slate"
                  delay={0}
                />
                <StatCard
                  title="Total Purchase"
                  value={`₹${filteredData.purchases.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  icon={TrendingUp}
                  color="orange"
                  delay={100}
                />
                <StatCard
                  title="Total Paid"
                  value={`₹${filteredData.paid.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  icon={TrendingDown}
                  color="teal"
                  delay={200}
                />
                <StatCard
                  title="Closing Balance"
                  value={`₹${filteredData.closing.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  icon={Wallet}
                  color={filteredData.closing > 0 ? 'red' : 'green'}
                  delay={300}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6">
                <DashboardCharts data={monthly} type="purchase" />
              </div>

              {/* Main Tabs */}
              <Tabs defaultValue="invoices" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                  <TabsList className="bg-white p-1.5 h-auto rounded-2xl border border-primary/10 shadow-sm w-full sm:w-auto grid grid-cols-3">
                    <TabsTrigger value="invoices" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Invoices</TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Payments</TabsTrigger>
                    <TabsTrigger value="ledger" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Ledger</TabsTrigger>
                  </TabsList>

                  {/* Search for Invoices */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-9 w-full sm:w-64 bg-white border-primary/10 rounded-xl focus:ring-primary/20"
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="invoices" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayInvoices.map((inv: any, idx: number) => {
                      // Fix: Handle mismatched keys (snake_case vs camelCase) safely
                      const amount = Number(inv.amount || inv.totalAmount || inv.total_amount || 0);
                      const date = inv.date || inv.billDate || inv.bill_date;
                      // Fallback: invoiceNo (frontend) -> invoice_no (db) -> billNo (frontend) -> bill_no (db)
                      const number = inv.invoiceNo || inv.invoice_no || inv.billNo || inv.bill_no || "N/A";
                      const status = inv.status || ((idx === 0 && summary.currentBalance > 0) ? 'pending' : 'paid'); // Dummy status logic fallback

                      return (
                        <Card key={idx} className="border-primary/5 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer bg-white rounded-[1.5rem] overflow-hidden">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl ${status === 'pending' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">#{number}</p>
                                <p className="text-sm text-slate-500">{format(new Date(date), 'dd MMM yyyy')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-slate-800">₹{amount.toLocaleString()}</p>
                              <Badge variant={status === 'paid' ? 'default' : 'destructive'} className="capitalize mt-1 rounded-lg">
                                {status || 'Unknown'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {displayInvoices.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-primary/10">
                        No invoices found
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="payments">
                  <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="divide-y divide-primary/5">
                        {payments?.map((payment: any) => (
                          <div key={payment.id} className="flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                                <Wallet className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{payment.mode}</p>
                                <p className="text-sm text-slate-500 mr-2">
                                  {format(new Date(payment.paymentDate), 'dd MMM yyyy')} • Ref: {payment.referenceNo || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">+₹{Number(payment.amount).toLocaleString()}</p>
                              <p className="text-xs text-primary/70 font-medium bg-primary/5 px-2 py-0.5 rounded-full inline-block mt-1">
                                Received
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ledger">
                  <LedgerTable data={ledger} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

