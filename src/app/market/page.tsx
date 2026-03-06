"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, TrendingUp, TrendingDown, Search, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

type MarketPrice = {
  crop: string;
  price: string;
  minPrice: number;
  maxPrice: number;
  unit: string;
  change: string;
  trend: "up" | "down";
  location: string;
};

export default function MarketPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Generate deterministic daily prices based on current date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Format date based on locale if possible, or just a simple format
    setLastUpdated(today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    const random = (min: number, max: number, offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      const rand = x - Math.floor(x);
      return Math.floor(rand * (max - min + 1)) + min;
    };

    const baseCrops = [
      { key: "wheat", locationKey: "delhi", unit: t("market.units.quintal"), baseMin: 2000, baseMax: 2300, offset: 1 },
      { key: "rice", locationKey: "punjab", unit: t("market.units.quintal"), baseMin: 4500, baseMax: 5000, offset: 2 },
      { key: "cotton", locationKey: "maharashtra", unit: t("market.units.quintal"), baseMin: 6000, baseMax: 6500, offset: 3 },
      { key: "maize", locationKey: "bihar", unit: t("market.units.quintal"), baseMin: 1800, baseMax: 2100, offset: 9 },
      { key: "soybean", locationKey: "maharashtra", unit: t("market.units.quintal"), baseMin: 4300, baseMax: 4700, offset: 8 },
      { key: "mustard", locationKey: "haryana", unit: t("market.units.quintal"), baseMin: 5000, baseMax: 5500, offset: 10 },
    ];

    const generatedPrices = baseCrops.map(item => {
      const minPrice = random(item.baseMin, item.baseMax, item.offset);
      const maxPrice = minPrice + random(100, 300, item.offset + 100);
      const prevMin = random(item.baseMin, item.baseMax, item.offset - 1); // Yesterday's pseudo-price
      const changePercent = (((minPrice - prevMin) / prevMin) * 100);

      return {
        crop: t(`market.crops.${item.key}`),
        location: t(`market.locations.${item.locationKey}`),
        unit: item.unit,
        minPrice,
        maxPrice,
        price: `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`,
        change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
        trend: changePercent >= 0 ? "up" : "down" as "up" | "down"
      };
    });

    setMarketPrices(generatedPrices);
  }, [t]);

  const filteredPrices = useMemo(() => {
    return marketPrices.filter(item => {
      const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = item.location.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesSearch && matchesLocation;
    });
  }, [marketPrices, searchQuery, locationQuery]);

  const trendingUpCount = useMemo(() => marketPrices.filter(p => p.trend === 'up').length, [marketPrices]);
  const trendingDownCount = useMemo(() => marketPrices.filter(p => p.trend === 'down').length, [marketPrices]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-green-200 selection:text-green-900">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595841696677-6489ff86151a?q=80&w=2400')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <PageHeader
          title={t("service.marketPrices.title")}
          description={t("service.marketPrices.description")}
          icon={ShoppingCart}
        />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-xl shadow-green-900/5 border-white/60 bg-white/70 backdrop-blur-xl">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        placeholder={t("market.searchPlaceholder")}
                        className="pl-11 h-14 text-base bg-white/80 border-slate-200/80 focus-visible:ring-green-500 rounded-xl shadow-sm transition-all duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="relative flex-1 group">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                      <Input
                        placeholder={t("market.locationPlaceholder")}
                        className="pl-11 h-14 text-base bg-white/80 border-slate-200/80 focus-visible:ring-green-500 rounded-xl shadow-sm transition-all duration-300"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                      />
                    </div>
                    <Button className="md:w-40 h-14 btn-primary-gradient text-white font-semibold rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all text-base gap-2">
                      {t("market.searchButton")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-green-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    {t("market.trendingUp")}
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-700" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{trendingUpCount}</p>
                  </div>
                  <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {t("market.commoditiesIncreasing")}
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-green-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    {t("market.trendingDown")}
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingDown className="h-4 w-4 text-red-700" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{trendingDownCount}</p>
                  </div>
                  <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {t("market.commoditiesDecreasing")}
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-green-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    {t("market.totalTracked")}
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-700" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{marketPrices.length}</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-2 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t("market.mandisUpdating")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Price Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-xl shadow-green-900/5 border-white/60 bg-white/70 backdrop-blur-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                <CardHeader className="bg-white/60 backdrop-blur-md border-b border-slate-100/60 flex flex-col sm:flex-row sm:items-center justify-between pb-5 relative z-10">
                  <div>
                    <CardTitle className="text-2xl font-serif text-slate-800">{t("market.todaysRates")}</CardTitle>
                    <CardDescription className="font-medium text-slate-500/80 mt-1">{t("market.liveUpdates")} {lastUpdated}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 relative z-10">
                  {filteredPrices.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 text-slate-500"
                    >
                      <div className="bg-slate-100/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="h-10 w-10 opacity-40 text-slate-600" />
                      </div>
                      <p className="text-xl font-medium text-slate-700">{t("market.noResults")}</p>
                      <p className="text-slate-500 mt-2 max-w-sm mx-auto">Try adjusting your search criteria to find what you're looking for.</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <AnimatePresence>
                        {filteredPrices.map((item, index) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            key={`${item.crop}-${item.location}`}
                          >
                            <Card className="border border-slate-200/60 bg-white/80 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 group rounded-2xl overflow-hidden relative h-full flex flex-col justify-between">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-500" />
                              <CardContent className="p-6 relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                  <div>
                                    <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-green-700 transition-colors">{item.crop}</h3>
                                    <p className="text-sm font-semibold text-slate-500/80 flex items-center gap-1.5 mt-1.5 uppercase tracking-wider">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                      {item.location}
                                    </p>
                                  </div>
                                  <div
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${item.trend === "up"
                                      ? "bg-green-100 border border-green-200 text-green-700"
                                      : "bg-red-100 border border-red-200 text-red-700"
                                      } shadow-sm`}
                                  >
                                    {item.trend === "up" ? (
                                      <TrendingUp className="h-4 w-4" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4" />
                                    )}
                                    <span className="text-sm font-bold tracking-wide">{item.change}</span>
                                  </div>
                                </div>
                                <div className="flex items-end justify-between bg-slate-50/80 p-5 rounded-xl border border-slate-100/80 group-hover:bg-green-50/50 transition-colors duration-300">
                                  <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">{t("market.minMaxPrice")}</p>
                                    <p className="text-2xl font-black text-slate-800 tracking-tight font-serif">{item.price}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Unit</p>
                                    <p className="text-sm font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md mt-1 border border-slate-100">{item.unit}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Market Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200/60 shadow-lg shadow-amber-900/5 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-amber-900 flex items-center gap-3 font-serif text-2xl">
                    <div className="p-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-amber-100 shadow-sm text-2xl">💡</div>
                    {t("market.expertTips")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-medium text-amber-900/80">
                    {[t("market.tip1"), t("market.tip2"), t("market.tip3"), t("market.tip4")].map((tip, i) => (
                      <li key={i} className="flex items-start gap-3.5 bg-white/70 backdrop-blur-md p-4 rounded-xl border border-amber-100/60 shadow-sm hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all duration-300 group">
                        <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                        </div>
                        <span className="leading-relaxed pt-0.5">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
