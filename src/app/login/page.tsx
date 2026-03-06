"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient, useSession } from "@/lib/auth-client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const redirectUrl = searchParams.get("redirect") || "/welcome";

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(redirectUrl);
    }
  }, [session, isPending, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: redirectUrl,
      });

      if (error?.code) {
        toast.error(t("auth.login.error"));
        setIsLoading(false);
        return;
      }

      toast.success(t("auth.login.success"));
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = redirectUrl;
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
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
          <p className="text-green-950 font-black tracking-tight text-xl">Authenticating...</p>
          <p className="text-green-700/60 text-sm mt-1">Preparing your agricultural dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left side Image block */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-green-900 border-r border-slate-100">
        <Image
          src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=85&w=2400"
          alt="Agriculture Field"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-green-950/80 via-green-950/40 to-transparent z-10"></div>

        {/* Top Logo */}
        <div className="absolute top-12 left-16 right-12 z-20">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl group-hover:bg-green-500 transition-all duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">RythuMitra</span>
          </Link>
        </div>

        <div className="absolute bottom-16 right-16 left-32 z-20 text-white text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Empowering Indian Farmers
          </div>
          <h2 className="text-6xl font-black mb-6 leading-[1.1] tracking-tight font-serif">
            Welcome Back to <br />
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">RythuMitra.</span>
          </h2>
          <p className="text-xl text-white/70 leading-relaxed max-w-xl ml-auto">
            Access your personalized crop reports, live market insights, and real-time disease diagnostic tools.
          </p>

          <div className="flex justify-end gap-10 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-white">Live</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Market Data</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">AI</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Diagnostics</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">Smart</p>
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Irrigation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 relative bg-white">

        {/* Floating return button */}
        <div className="absolute top-8 right-8">
          <Link href="/" className="text-sm font-bold text-slate-400 hover:text-green-600 flex items-center gap-2 transition-all">
            Return Home
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-green-50">→</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight font-serif">
              {t("auth.login.title")}
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              {t("auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800 font-bold text-sm ml-1">{t("auth.login.email")}</Label>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1 mb-1">
                <Label htmlFor="password" className="text-slate-800 font-bold text-sm">{t("auth.login.password")}</Label>
                <Link href="#" className="text-xs font-bold text-green-600 hover:text-green-800 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock className="h-full w-full" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 h-14 bg-slate-50 border-slate-100 focus-visible:bg-white focus-visible:border-green-500 focus-visible:ring-0 rounded-2xl transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-1 ml-1">
              <Checkbox
                id="rememberMe"
                className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 transition-all"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="rememberMe" className="text-sm font-semibold text-slate-600 cursor-pointer">
                {t("auth.login.rememberMe")}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-15 text-lg font-black btn-primary-gradient text-white rounded-2xl mt-4 gap-3 shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  {t("auth.login.button")}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-bold text-sm">
              {t("auth.login.noAccount")}{' '}
              <Link href="/register" className="text-green-600 hover:text-green-700 hover:underline underline-offset-4 decoration-2">
                {t("auth.login.createAccount")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
