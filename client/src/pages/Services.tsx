import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Building2, Receipt, Package } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: ShoppingBag,
      title: "Retail Sales",
      description: "A wide range of books, stationery, and art supplies for students and professionals. Visit our store for the latest collections.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Building2,
      title: "Institutional Supply",
      description: "Bulk supply solutions for schools, colleges, and offices. We ensure timely delivery of course books and stationery kits.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Receipt,
      title: "Customer Billing Portal",
      description: "Digital access to your purchase history. View your ledger, download bills, and track payments anytime, anywhere.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Package,
      title: "Special Orders",
      description: "Need specific books or supplies? We take special orders for rare editions, competitive exam materials, and bulk gifts.",
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for all your educational and professional needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                  <CardContent className="p-8 flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${service.color} transition-transform group-hover:scale-110 duration-300`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
