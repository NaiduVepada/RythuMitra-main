"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Building2, Search, ExternalLink, IndianRupee, Users, Tractor, Leaf, ChevronRight, Landmark } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SchemesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Schemes");

  // Translation mapping for display categories
  const categoryKeys: Record<string, string> = {
    "All Schemes": "schemes.category.all",
    "Financial Support": "schemes.category.financial",
    "Credit/Loan": "schemes.category.credit",
    "Insurance": "schemes.category.insurance",
    "Mechanization": "schemes.category.mechanization",
    "Organic Farming": "schemes.category.organic",
  };

  const categories = [
    "All Schemes",
    "Financial Support",
    "Credit/Loan",
    "Insurance",
    "Mechanization",
    "Organic Farming",
  ];

  const schemes = useMemo(() => [
    {
      id: "pmkisan",
      title: t("schemes.pmkisan.title"),
      subtitle: t("schemes.pmkisan.subtitle"),
      description: t("schemes.pmkisan.description"),
      category: "Financial Support",
      icon: IndianRupee,
      eligibility: t("schemes.pmkisan.eligibility"),
      benefit: t("schemes.pmkisan.benefit"),
      link: "https://pmkisan.gov.in"
    },
    {
      id: "kcc",
      title: t("schemes.kcc.title"),
      subtitle: t("schemes.kcc.subtitle"),
      description: t("schemes.kcc.description"),
      category: "Credit/Loan",
      icon: IndianRupee,
      eligibility: t("schemes.kcc.eligibility"),
      benefit: t("schemes.kcc.benefit"),
      link: "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card"
    },
    {
      id: "pmfby",
      title: t("schemes.pmfby.title"),
      subtitle: t("schemes.pmfby.subtitle"),
      description: t("schemes.pmfby.description"),
      category: "Insurance",
      icon: Users,
      eligibility: t("schemes.pmfby.eligibility"),
      benefit: t("schemes.pmfby.benefit"),
      link: "https://pmfby.gov.in"
    },
    {
      id: "smam",
      title: t("schemes.smam.title"),
      subtitle: t("schemes.smam.subtitle"),
      description: t("schemes.smam.description"),
      category: "Mechanization",
      icon: Tractor,
      eligibility: t("schemes.smam.eligibility"),
      benefit: t("schemes.smam.benefit"),
      link: "https://agrimachinery.nic.in"
    },
    {
      id: "pkvy",
      title: t("schemes.paramparagat.title") || "PKVY Organic Farming",
      subtitle: t("schemes.paramparagat.subtitle") || "Organic Farming Support",
      description: t("schemes.paramparagat.description") || "Promotes organic farming through cluster approach.",
      category: "Organic Farming",
      icon: Leaf,
      eligibility: t("schemes.paramparagat.eligibility") || "Farmers in clusters",
      benefit: t("schemes.paramparagat.benefit") || "₹50,000/hectare",
      link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
    },
    {
      id: "nhm",
      title: t("schemes.horticulture.title") || "National Horticulture Mission",
      subtitle: t("schemes.horticulture.subtitle") || "NHM",
      description: t("schemes.horticulture.description") || "Support for horticulture sector holistic growth.",
      category: "Financial Support",
      icon: Leaf,
      eligibility: t("schemes.horticulture.eligibility") || "Individual farmers",
      benefit: t("schemes.horticulture.benefit") || "Varies by component",
      link: "https://midh.gov.in"
    },
  ], [t]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      // Filter by category
      if (selectedCategory !== "All Schemes" && scheme.category !== selectedCategory) {
        return false;
      }

      // Filter by search query across multiple fields
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          scheme.title.toLowerCase().includes(query) ||
          scheme.subtitle.toLowerCase().includes(query) ||
          scheme.description.toLowerCase().includes(query) ||
          scheme.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, schemes]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-green-200 selection:text-green-900 bg-slate-50">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2400')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <PageHeader
          title={t("service.govSchemes.title")}
          description={t("service.govSchemes.description")}
          icon={Building2}
        />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Search Query */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/60 shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-2 sm:p-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors" />
                    <Input
                      placeholder={t("schemes.searchPlaceholder")}
                      className="pl-12 h-14 text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium text-slate-700 placeholder:text-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-center md:justify-start">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === selectedCategory ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-300 rounded-xl font-semibold h-12 px-6 ${category === selectedCategory
                      ? 'btn-primary-gradient text-white shadow-lg shadow-green-600/20 scale-105'
                      : 'border-white bg-white/60 backdrop-blur-md text-slate-600 hover:text-green-700 hover:bg-white hover:border-green-100 hover:shadow-md'
                      }`}
                  >
                    {t(categoryKeys[category])}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-green-900/5 bg-gradient-to-br from-green-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-widest">{t("schemes.totalTracked")}</p>
                      <div className="bg-green-100 p-2 rounded-lg"><Landmark className="h-4 w-4 text-green-700" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 font-serif tracking-tight">100+</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-blue-900/5 bg-gradient-to-br from-blue-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{t("schemes.financialAid")}</p>
                      <div className="bg-blue-100 p-2 rounded-lg"><IndianRupee className="h-4 w-4 text-blue-700" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 font-serif tracking-tight">45</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-emerald-900/5 bg-gradient-to-br from-emerald-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">{t("schemes.subsidyPrograms")}</p>
                      <div className="bg-emerald-100 p-2 rounded-lg"><Tractor className="h-4 w-4 text-emerald-700" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 font-serif tracking-tight">32</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-orange-900/5 bg-gradient-to-br from-orange-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">{t("schemes.insurance")}</p>
                      <div className="bg-orange-100 p-2 rounded-lg"><Users className="h-4 w-4 text-orange-700" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-800 font-serif tracking-tight">8</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Schemes List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">{t("schemes.availableSchemes")}</h2>
                <span className="text-green-700 font-bold bg-green-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm shadow-sm border border-green-200">
                  {filteredSchemes.length} {t("schemes.results")}
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredSchemes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-slate-200/50"
                  >
                    <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Search className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-3 tracking-tight">{t("schemes.noSchemesFound")}</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-lg mb-8 font-medium">
                      {t("schemes.noSchemesFoundDesc")}
                    </p>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl h-12 px-8 font-bold"
                      onClick={() => { setSearchQuery(""); setSelectedCategory("All Schemes"); }}
                    >
                      {t("schemes.clearFilters")}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8"
                  >
                    {filteredSchemes.map((scheme, index) => {
                      // Unique colors based on category
                      const categoryColors: Record<string, string> = {
                        "Financial Support": "from-emerald-400 to-green-600 shadow-emerald-900/20",
                        "Credit/Loan": "from-blue-400 to-blue-600 shadow-blue-900/20",
                        "Insurance": "from-purple-400 to-purple-600 shadow-purple-900/20",
                        "Mechanization": "from-orange-400 to-orange-600 shadow-orange-900/20",
                        "Organic Farming": "from-green-500 to-teal-600 shadow-teal-900/20",
                        "All Schemes": "from-green-400 to-green-600"
                      };
                      const colorCombo = categoryColors[scheme.category] || categoryColors["All Schemes"];

                      return (
                        <motion.div key={scheme.id} variants={itemVariants} layoutId={`card-${scheme.id}`}>
                          <Card className="h-full border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col relative">
                            {/* Decorative top gradient thick border */}
                            <div className={`h-2 w-full bg-gradient-to-r ${colorCombo}`} />

                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-transparent rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />

                            <CardHeader className="pb-4 relative z-10 px-6 sm:px-8 pt-6 sm:pt-8">
                              <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorCombo} text-white shadow-lg`}>
                                  <scheme.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/80 border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg backdrop-blur-md">
                                  {t(categoryKeys[scheme.category])}
                                </span>
                              </div>
                              <CardTitle className="text-2xl sm:text-3xl font-serif text-slate-800 tracking-tight leading-tight">{scheme.title}</CardTitle>
                              <CardDescription className="text-base sm:text-lg font-medium text-slate-500 mt-2">
                                {scheme.subtitle}
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col relative z-10 px-6 sm:px-8 pb-6 sm:pb-8">
                              <p className="text-slate-600 leading-relaxed mb-6 font-medium text-base sm:text-lg">{scheme.description}</p>

                              <div className="space-y-3 mt-auto mb-6 bg-white/50 rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("schemes.eligibility")}</span>
                                  <span className="text-sm font-semibold text-slate-700 sm:text-right">{scheme.eligibility}</span>
                                </div>
                                <div className="h-px w-full bg-slate-200/60 my-2" />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="text-xs font-bold text-green-600/80 uppercase tracking-wider">{t("schemes.benefit")}</span>
                                  <span className="text-base font-black text-green-700 sm:text-right">{scheme.benefit}</span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="flex-1 outline-none">
                                  <Button className={`w-full bg-gradient-to-r ${colorCombo} hover:opacity-90 text-white shadow-lg font-bold h-12 md:h-14 rounded-xl text-base transition-all group-hover:shadow-xl hover:-translate-y-0.5`}>
                                    {t("schemes.applyNow")}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </Button>
                                </a>
                                <Link href={`/schemes/${scheme.id}`} className="flex-1 outline-none">
                                  <Button variant="outline" className="w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold h-12 md:h-14 rounded-xl text-base transition-all bg-white shadow-sm">
                                    {t("schemes.learnMore")}
                                    <ChevronRight className="ml-1 h-4 w-4 text-slate-400" />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-green-800 via-emerald-800 to-green-950 text-white shadow-2xl mt-12 relative border-0 rounded-3xl overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700 group-hover:-rotate-6">
                  <Building2 className="h-64 w-64 text-white" />
                </div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2400')] opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                  <div className="max-w-xl">
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-sm">{t("schemes.needHelp")}</h3>
                    <p className="text-green-100 text-lg sm:text-xl font-medium leading-relaxed drop-shadow-sm">
                      {t("schemes.needHelpDesc")}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                    <Link href="/contact" className="outline-none w-full sm:w-auto">
                      <Button variant="secondary" size="lg" className="bg-white text-green-900 hover:bg-green-50 font-bold h-14 md:h-16 px-8 rounded-xl shadow-xl hover:shadow-green-900/40 w-full sm:w-auto hover:-translate-y-1 transition-all text-base md:text-lg">
                        {t("schemes.contactSupport")}
                      </Button>
                    </Link>
                    <a href="#" className="outline-none w-full sm:w-auto">
                      <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold h-14 md:h-16 px-8 rounded-xl backdrop-blur-md w-full sm:w-auto transition-all text-base md:text-lg">
                        {t("schemes.downloadGuide")}
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
