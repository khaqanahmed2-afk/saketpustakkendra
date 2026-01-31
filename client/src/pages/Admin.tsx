import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Upload, ArrowRight, FileSpreadsheet, Package } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { motion } from "framer-motion";

export default function Admin() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Redirect to="/login" />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-secondary/30 pb-20">
        <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-12 pb-20 px-4 border-b border-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-slate-800">Admin Console</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Manage your billing data, imports, and system configurations from one central hub.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Vyapar Sync Card */}
            <div className="group relative">
              <Card className="relative h-full border-primary/10 bg-white rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                <CardHeader className="p-8 pb-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Vyapar Billing Sync</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Import Customers, Invoices, and Items directly from Vyapar Excel exports. Sync to your database for live reporting.
                  </p>

                  <Link href="/admin/vyapar-sync">
                    <ShinyButton className="w-full bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200 group-hover:translate-x-1 transition-all rounded-xl py-6">
                      Open Sync Tool <ArrowRight className="w-4 h-4 ml-2" />
                    </ShinyButton>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Product Management Card */}
            <div className="group relative">
              <Card className="relative h-full border-primary/10 bg-white rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                <CardHeader className="p-8 pb-4">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800">Product Management</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Add, edit, and manage shop products with images. Products appear instantly on the shop page.
                  </p>

                  <Link href="/admin/products">
                    <ShinyButton className="w-full bg-green-500 text-white hover:bg-green-600 shadow-green-200 group-hover:translate-x-1 transition-all rounded-xl py-6">
                      Manage Products <ArrowRight className="w-4 h-4 ml-2" />
                    </ShinyButton>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Legacy Tally Import Card (Faded) */}
            <div className="group relative opacity-70 hover:opacity-100 transition-opacity">
              <Card className="relative h-full border-slate-100 bg-white rounded-[2rem] shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-700">Legacy Tally Import</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2">
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Classic XML-based import for Tally Masters and Vouchers. Use this for specific accounting archival needs.
                  </p>

                  <div className="opacity-50 pointer-events-none">
                    <ShinyButton variant="secondary" className="w-full bg-slate-100 text-slate-400 border-transparent rounded-xl py-6">
                      Coming Soon
                    </ShinyButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

