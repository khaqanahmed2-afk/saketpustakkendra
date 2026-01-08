import { Layout } from "@/components/Layout";
import { ShinyButton } from "@/components/ui/shiny-button";
import { WaveSeparator } from "@/components/WaveSeparator";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, GraduationCap, PenTool, Award, Users, Building, ShoppingBag, Receipt, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-cream overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 bg-wave-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              Serving Quality Since 1990
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-foreground mb-6">
              Elevate Your <br />
              <span className="text-primary relative">
                Learning Journey
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 font-sans leading-relaxed">
              Discover a curated collection of premium books, stationery, and art supplies.
              Where quality meets creativity for students and professionals alike.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/login">
                <ShinyButton className="w-full sm:w-auto h-14 text-lg">
                  Customer Login
                </ShinyButton>
              </Link>
              <ShinyButton variant="outline" className="w-full sm:w-auto h-14 text-lg border-2">
                Visit Store
              </ShinyButton>
            </div>
          </motion.div>

          {/* Hero Image / Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" 
                alt="Happy students with books" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white text-left">
                <p className="font-bold text-2xl font-display">Saket Pustak Kendra</p>
                <p className="text-white/80">Serving Rudauli since 1990</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <WaveSeparator fill="#ffffff" />
      </section>

      {/* Feature Icons Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Award} 
              title="Trusted Since 1990" 
              desc="Legacy of quality." 
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard 
              icon={ShoppingBag} 
              title="Wide Product Range" 
              desc="Everything you need." 
              color="bg-orange-50 text-orange-600"
            />
            <FeatureCard 
              icon={Users} 
              title="Student-Friendly" 
              desc="Affordable pricing." 
              color="bg-pink-50 text-pink-600"
            />
            <FeatureCard 
              icon={Building} 
              title="Institutional Supply" 
              desc="Partner for schools." 
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-orange-50/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-display font-bold mb-6">Learn. Create. Succeed.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Saket Pustak Kendra, we believe in building long-term relationships based on trust and consistency. 
              We are not just a store; we are a partner in your educational journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['School Books', 'Competitive Exams', 'Stationery', 'Art Supplies'].map((item) => (
                <span key={item} className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-slate-700 border border-slate-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}></div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <StatItem value="20k+" label="Happy Students" />
            <StatItem value="35+" label="Years Experience" />
            <StatItem value="5000+" label="Products" />
            <StatItem value="50+" label="Institutions Served" />
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <CategoryCard title="School Essentials" color="bg-blue-100 text-blue-800" />
            <CategoryCard title="Office Stationery" color="bg-green-100 text-green-800" />
            <CategoryCard title="Art & Craft" color="bg-pink-100 text-pink-800" />
            <CategoryCard title="Exam Books" color="bg-purple-100 text-purple-800" />
            <CategoryCard title="Eco-Friendly" color="bg-teal-100 text-teal-800" />
          </div>
        </div>
      </section>

      {/* Customer Portal Intro */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-display font-bold mb-6">Already Our Customer?</h2>
              <p className="text-slate-300 text-lg mb-8">
                Access your digital ledger, download bills, and track your payments seamlessly through our customer portal.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="bg-primary rounded-full p-1"><Receipt className="w-4 h-4" /></div>
                  <span>View detailed ledger</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary rounded-full p-1"><ArrowRight className="w-4 h-4" /></div>
                  <span>Download PDF bills instantly</span>
                </li>
              </ul>
              <Link href="/login">
                <ShinyButton className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100">
                  Login with Mobile
                </ShinyButton>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                {/* Mock UI for dashboard preview */}
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-white/20 rounded-full"></div>
                  <div className="h-32 w-full bg-white/10 rounded-xl"></div>
                  <div className="flex gap-4">
                    <div className="h-12 w-1/2 bg-primary rounded-lg"></div>
                    <div className="h-12 w-1/2 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by the Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              text="Saket Pustak Kendra has been my go-to store since my school days. Now I buy books for my children here." 
              author="Amit Kumar" 
              role="Parent" 
            />
            <TestimonialCard 
              text="The quality of stationery and their service is unmatched in Rudauli. Highly recommended!" 
              author="Priya Singh" 
              role="Teacher" 
            />
            <TestimonialCard 
              text="Their institutional supply service is prompt and professional. Very reliable partners." 
              author="Principal" 
              role="Local School" 
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group p-6 rounded-3xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto ${color} transition-transform group-hover:scale-110 duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-80 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function CategoryCard({ title, color }: { title: string, color: string }) {
  return (
    <div className={`${color} p-6 rounded-2xl text-center font-bold hover:shadow-lg cursor-pointer transition-all hover:scale-105`}>
      {title}
    </div>
  );
}

function TestimonialCard({ text, author, role }: { text: string, author: string, role: string }) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-8">
        <p className="text-muted-foreground italic mb-6">"{text}"</p>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
