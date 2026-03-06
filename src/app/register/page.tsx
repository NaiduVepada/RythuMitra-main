"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/welcome");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("auth.register.error.passwordMatch"));
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });
      if (error) {
        if (error.status === 422 || error.code === "USER_ALREADY_EXISTS") {
          toast.error(t("auth.register.error.userExists"));
        } else {
          toast.error(t("auth.register.error.userExists"));
        }
        setIsLoading(false);
        return;
      }

      toast.success(t("auth.register.success"));
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    } catch (err) {
      toast.error("An unexpected error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  if (isPending || session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50/50">
        <div className="text-center">
          <div className="relative h-20 w-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
            <div className="relative h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-green-100">
              <Leaf className="h-10 w-10 text-green-600 animate-float" />
            </div>
          </div>
          <p className="text-green-950 font-black tracking-tight text-xl">Setting up environment...</p>
          <p className="text-green-700/60 text-sm mt-1">Almost there, preparing your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Right side Image block (Mirrored orientation vs login) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden order-2">
        <Image
          src="https://images.unsplash.com/photo-1595841696677-6489ff86151a?q=85&w=2400"
          alt="Agriculture Field Sunrise"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-950/40 to-transparent z-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-12 left-12 right-12 z-20">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl group-hover:bg-green-500 transition-all duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">RythuMitra</span>
          </Link>
        </div>

        <div className="absolute bottom-16 left-16 right-32 z-20 text-white">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-white/20 text-green-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            Join 50k+ Happy Farmers
          </div>
          <h2 className="text-6xl font-black mb-6 leading-[1.1] tracking-tight font-serif">
            The Future of <br />
            <span className="text-green-400">Sustainable</span> Farming.
          </h2>
          <p className="text-xl text-white/80 leading-relaxed max-w-xl">
            Empower your farm with AI-driven insights, real-time market data, and a supportive community of organic enthusiasts.
          </p>

          <div className="flex gap-10 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">98%</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Support</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">Free</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Left side form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 relative order-1 bg-white">

        {/* Floating return button */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-green-600 flex items-center gap-2 transition-all">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-green-50">←</span>
            Return Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight font-serif">
              {t("auth.register.title")}
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t("auth.register.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-800 font-bold text-sm ml-1">{t("auth.register.name")}</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <User className="h-full w-full" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="E.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:border-green-500 focus-visible:ring-0 rounded-2xl transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800 font-bold text-sm ml-1">{t("auth.register.email")}</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail className="h-full w-full" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:border-green-500 focus-visible:ring-0 rounded-2xl transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-800 font-bold text-sm ml-1">{t("auth.register.password")}</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:border-green-500 focus-visible:ring-0 rounded-2xl transition-all shadow-sm text-sm"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-800 font-bold text-sm ml-1">{t("auth.register.confirmPassword")}</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-11 h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:border-green-500 focus-visible:ring-0 rounded-2xl transition-all shadow-sm text-sm"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-800/80 leading-relaxed font-medium">
                By creating an account, you agree to receive automated farming alerts and notifications.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-15 text-lg font-black btn-primary-gradient text-white rounded-2xl mt-4 gap-3 shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Registering...
                </>
              ) : (
                <>
                  {t("auth.register.button")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-bold text-sm">
              {t("auth.register.hasAccount")}{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 hover:underline underline-offset-4 decoration-2">
                {t("auth.register.loginHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
