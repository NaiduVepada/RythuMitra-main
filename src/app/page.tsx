"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Sprout, Droplets, BookOpen, LineChart, ShoppingCart, Building2,
  ArrowRight, Leaf, Star, Users, TrendingUp, Shield, ChevronDown,
  CheckCircle, Play
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

const SERVICES = [
  {
    titleKey: "service.cropAdvisory.title",
    descKey: "service.cropAdvisory.description",
    icon: Sprout,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
    href: "/crop-advisory",
    color: "from-green-500 to-emerald-600",
    badge: "AI Powered",
  },
  {
    titleKey: "service.smartIrrigation.title",
    descKey: "service.smartIrrigation.description",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    href: "/irrigation",
    color: "from-blue-500 to-cyan-600",
    badge: "Smart Tech",
  },
  {
    titleKey: "service.knowledgeHub.title",
    descKey: "service.knowledgeHub.description",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
    href: "/knowledge",
    color: "from-amber-500 to-orange-500",
    badge: "500+ Articles",
  },
  {
    titleKey: "service.farmManagement.title",
    descKey: "service.farmManagement.description",
    icon: LineChart,
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&q=80",
    href: "/farm-management",
    color: "from-purple-500 to-violet-600",
    badge: "Analytics",
  },
  {
    titleKey: "service.marketPrices.title",
    descKey: "service.marketPrices.description",
    icon: ShoppingCart,
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80",
    href: "/market",
    color: "from-rose-500 to-pink-600",
    badge: "Live Prices",
  },
  {
    titleKey: "service.govSchemes.title",
    descKey: "service.govSchemes.description",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    href: "/schemes",
    color: "from-teal-500 to-green-600",
    badge: "100+ Schemes",
  },
];

const STATS = [
  { value: "50K+", label: "home.stats.farmers", icon: Users, color: "from-green-400 to-emerald-500" },
  { value: "500+", label: "home.stats.crops", icon: Leaf, color: "from-lime-400 to-green-500" },
  { value: "24/7", label: "home.stats.support", icon: Shield, color: "from-blue-400 to-cyan-500" },
  { value: "100+", label: "home.stats.schemes", icon: Star, color: "from-amber-400 to-orange-500" },
];

const FEATURES = [
  "AI-powered crop disease detection",
  "Real-time market price updates",
  "Smart irrigation scheduling",
  "Government scheme notifications",
  "Weather forecasts & alerts",
  "Expert farming consultation",
];

export default function Home() {
  const { t } = useLanguage();

  const services = useMemo(() =>
    SERVICES.map(s => ({ ...s, title: t(s.titleKey), desc: t(s.descKey) })),
    [t]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=85"
          alt="Beautiful green farmland at sunrise"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-gradient" />

        {/* Decorative circles */}
        <div className="absolute top-24 right-12 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-8  w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-green-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 animate-fade-in-up">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            India&apos;s Most Trusted Farmers Platform
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight animate-fade-in-up delay-100">
            {t("home.hero.title")}
            <br />
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
              {t("home.hero.subtitle")}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t("home.hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/crop-advisory">
              <Button
                size="lg"
                className="btn-primary-gradient text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-green-900/40 gap-3"
              >
                {t("home.hero.getStarted")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/knowledge">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 font-semibold text-lg px-10 py-7 rounded-2xl gap-3"
              >
                <Play className="h-5 w-5 fill-current" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Feature bullets */}
          <div className="mt-14 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-400">
            {FEATURES.map((f) => (
              <span key={f} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-sm px-4 py-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                {f}
              </span>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronDown className="h-7 w-7 text-white/50" />
          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-14 bg-gradient-to-b from-green-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={value} className="text-center group">
                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-sm font-medium text-slate-300">{t(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES SECTION ============ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50/50 to-white relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_80%_50%,#16a34a,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-5 py-2 rounded-full mb-5 border border-green-200">
              <Sprout className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight">
              {t("home.services.title")}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t("home.services.description")}
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <span className={`absolute top-4 left-4 bg-gradient-to-r ${service.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {service.badge}
                    </span>

                    {/* Icon on image */}
                    <div className={`absolute bottom-4 right-4 bg-gradient-to-br ${service.color} rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
                      {service.desc}
                    </p>
                    <div className={`flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                      Explore Now
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-200" style={{ color: "inherit" }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIAL / ABOUT RIBBON ============ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=70"
            alt="Farmers in field"
            fill
            className="object-cover opacity-15 mix-blend-overlay"
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            Trusted by 50,000+ Indian Farmers
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/crop-advisory">
              <Button
                size="lg"
                className="bg-white text-green-800 hover:bg-green-50 font-bold text-lg px-10 py-7 rounded-2xl shadow-xl gap-3 transition-all hover:scale-105"
              >
                {t("home.cta.button")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white hover:bg-white/15 font-semibold text-lg px-10 py-7 rounded-2xl"
              >
                {t("home.hero.contactSupport")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Images grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80"
                    alt="Drip irrigation"
                    fill className="object-cover"
                  />
                </div>
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&q=80"
                    alt="Crop field"
                    fill className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-36 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80"
                    alt="Vegetables"
                    fill className="object-cover"
                  />
                </div>
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80"
                    alt="Farm management"
                    fill className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-green-200">
                <Shield className="h-4 w-4" />
                Why Choose RythuMitra
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                Technology That Empowers Every Farmer
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                From AI-driven disease detection to real-time market prices, RythuMitra brings together the best tools to help Indian farmers grow smarter and earn more.
              </p>
              <div className="space-y-4">
                {[
                  { title: "AI-Powered Insights", desc: "Gemini Vision AI analyzes your crops for diseases and pests instantly." },
                  { title: "Real-Time Data", desc: "Live market prices, weather alerts, and government scheme updates." },
                  { title: "Multi-Language Support", desc: "Available in Telugu, Hindi, Tamil, Marathi, and English." },
                  { title: "Always Free", desc: "All core features are freely accessible to every registered farmer." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100 hover:border-green-200 hover:bg-green-50 transition-all">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-block mt-8">
                <Button
                  size="lg"
                  className="btn-primary-gradient text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-green-900/20 gap-2"
                >
                  Join Free Today
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}