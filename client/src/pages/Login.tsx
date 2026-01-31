import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { ShinyButton } from "@/components/ui/shiny-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { checkMobile, setupPin, loginWithPin } = useAuth();
  const [step, setStep] = useState<"phone" | "pin" | "setup">("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsSubmitting(true);
    const exists = await checkMobile(phone);
    setIsSubmitting(false);
    if (exists) {
      setStep("pin");
    } else {
      setStep("setup");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (step === "setup") {
      if (pin !== confirmPin) {
        alert("PINs do not match");
        setIsSubmitting(false);
        return;
      }
      await setupPin(phone, pin);
    } else {
      await loginWithPin(phone, pin);
    }
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/20">

        {/* Soft Decorative Blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="border-white/40 shadow-2xl bg-white/70 backdrop-blur-3xl overflow-hidden p-0">
            <div className="h-2 bg-gradient-to-r from-primary to-accent w-full" />
            <CardHeader className="text-center pt-10 pb-6">
              <div className="mx-auto bg-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-primary border border-primary/10 shadow-lg transform rotate-3">
                {step === "phone" ? <Phone className="w-9 h-9" /> : <Lock className="w-9 h-9" />}
              </div>
              <CardTitle className="text-3xl font-display font-black text-slate-800 mb-2">
                {step === "phone" ? "Welcome Back" : step === "setup" ? "Secure Your Account" : "Enter Secure PIN"}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium px-6 text-base">
                {step === "phone"
                  ? "Enter your mobile number to access your Saket Bookshelf portal"
                  : step === "setup" ? "First time here? Please create your 4-digit access PIN" : "Please enter your 4-digit secret PIN to continue"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-12 px-10">
              {step === "phone" ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-500 font-bold ml-1 uppercase text-xs tracking-widest">Mobile Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 text-lg tracking-wide font-medium bg-white/80"
                      required
                    />
                  </div>
                  <ShinyButton type="submit" className="w-full h-12 text-base font-bold tracking-wide rounded-xl" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Get Started"}
                  </ShinyButton>
                </form>
              ) : (
                <form onSubmit={handleAuth} className="space-y-6">
                  <div className="space-y-2 relative">
                    <Label htmlFor="pin" className="text-slate-500 font-bold ml-1 uppercase text-xs tracking-widest">
                      {step === "setup" ? "Choose Secure PIN" : "Your Secret PIN"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="pin"
                        type={showPin ? "text" : "password"}
                        placeholder="••••"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="h-12 text-center text-2xl tracking-[0.5em] font-bold bg-white/80"
                        maxLength={4}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-2"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {step === "setup" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPin" className="text-slate-500 font-bold ml-1 uppercase text-xs tracking-widest">Confirm PIN</Label>
                      <Input
                        id="confirmPin"
                        type={showPin ? "text" : "password"}
                        placeholder="••••"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="h-14 rounded-2xl border-slate-200 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 text-3xl tracking-[0.5em] text-center font-black px-6 transition-all shadow-inner"
                        maxLength={4}
                        required
                      />
                    </div>
                  )}
                  <ShinyButton type="submit" className="w-full h-14 text-xl rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20" disabled={isSubmitting}>
                    {isSubmitting ? "Securing..." : step === "setup" ? "Create & Sign In" : "Sign In Securely"}
                  </ShinyButton>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Use a different phone number
                  </button>
                </form>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

