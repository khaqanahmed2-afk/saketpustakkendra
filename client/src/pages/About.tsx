import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { History, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
              Rooted in Trust. <br/>
              <span className="text-primary">Growing with Time.</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Serving Rudauli & Ayodhya with quality education supplies for over three decades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-cream/50 border-none shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our History</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Established in 1990, Saket Pustak Kendra started with a simple mission: to make quality educational resources accessible to everyone in Rudauli. What began as a small bookshop has grown into a trusted institution, serving generations of students, schools, and offices across the region.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/50 border-none shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Mission & Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We aim to empower every learner with the best tools for success. Our vision is to be the most reliable partner in your educational journey, ensuring that quality books and stationery are never out of reach.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">30+</span>
                </div>
                <h3 className="font-bold mb-2">Years Experience</h3>
                <p className="text-sm text-muted-foreground">Deep understanding of academic needs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">Transparent billing & easy returns</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">Digital</span>
                </div>
                <h3 className="font-bold mb-2">Smart Access</h3>
                <p className="text-sm text-muted-foreground">Online portal for bills & ledger</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
