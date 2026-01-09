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
      <div className="min-h-[80vh] flex items-center justify-center bg-cream/50 relative overflow-hidden py-12">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4 relative z-10"
        >
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="h-2 bg-gradient-to-r from-primary to-orange-400 w-full" />
            <CardHeader className="text-center pt-8 pb-6">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-primary">
                {step === "phone" ? <Phone className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
              </div>
              <CardTitle className="text-2xl font-display font-bold">
                {step === "phone" ? "Welcome Back!" : step === "setup" ? "Create PIN" : "Enter PIN"}
              </CardTitle>
              <CardDescription className="text-base">
                {step === "phone" 
                  ? "Enter your mobile number to access your dashboard" 
                  : step === "setup" ? "First time here? Create your PIN" : "Enter your PIN to login"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8 px-8">
              {step === "phone" ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-lg"
                      required
                    />
                  </div>
                  <ShinyButton type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Checking..." : "Continue"}
                  </ShinyButton>
                </form>
              ) : (
                <form onSubmit={handleAuth} className="space-y-6">
                  <div className="space-y-2 relative">
                    <Label htmlFor="pin">{step === "setup" ? "Choose 4-digit PIN" : "4-digit PIN"}</Label>
                    <div className="relative">
                      <Input 
                        id="pin"
                        type={showPin ? "text" : "password"}
                        placeholder="****"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-lg tracking-widest text-center"
                        maxLength={4}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {step === "setup" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">Confirm PIN</Label>
                      <Input 
                        id="confirmPin"
                        type={showPin ? "text" : "password"}
                        placeholder="****"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-lg tracking-widest text-center"
                        maxLength={4}
                        required
                      />
                    </div>
                  )}
                  <ShinyButton type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : step === "setup" ? "Create & Login" : "Login"}
                  </ShinyButton>
                  <button 
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Change Phone Number
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
