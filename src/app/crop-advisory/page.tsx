"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import CropAdvisorForm from "@/components/CropAdvisorForm";
import AIDetectionForm from "@/components/AIDetectionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ScanSearch, Lightbulb, CloudRain, Sun, Bug } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CropAdvisoryPage() {
  const { t } = useLanguage();

  const tips = [
    {
      title: "Rabi Season Crops",
      content: "Best time to plant wheat, barley, and mustard. Ensure proper irrigation schedule.",
      icon: CloudRain,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Organic Pest Control",
      content: "Use neem oil spray for natural pest control without harmful chemicals.",
      icon: Bug,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Crop Rotation",
      content: "Rotate legumes with cereals to improve soil nitrogen naturally.",
      icon: Sprout,
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <PageHeader
        title={t("service.cropAdvisory.title")}
        description={t("service.cropAdvisory.description")}
        icon={Sprout}
        image="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=1400&q=80"
        badge={t("service.cropAdvisory.badge")}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Two-tab layout: Crop Advisory | AI Detection */}
          <Tabs defaultValue="crop" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl h-auto">
              <TabsTrigger
                value="crop"
                className="flex flex-col md:flex-row items-center justify-center gap-3 py-4 rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-900/20 transition-all duration-300"
              >
                <div className="p-2 bg-current/10 rounded-lg">
                  <Sprout className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm lg:text-base leading-none">
                    {t("service.cropAdvisory.tabs.crop")}
                  </span>
                  <span className="hidden md:block text-[10px] opacity-80 font-medium uppercase tracking-wider mt-1">{t("service.cropAdvisory.tabs.cropSub")}</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="detect"
                className="flex flex-col md:flex-row items-center justify-center gap-3 py-4 rounded-xl data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-900/20 transition-all duration-300"
              >
                <div className="p-2 bg-current/10 rounded-lg">
                  <ScanSearch className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm lg:text-base leading-none">
                    {t("service.cropAdvisory.tabs.ai")}
                  </span>
                  <span className="hidden md:block text-[10px] opacity-80 font-medium uppercase tracking-wider mt-1">{t("service.cropAdvisory.tabs.aiSub")}</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 animate-fade-in-up">
              <TabsContent value="crop" className="m-0 focus-visible:outline-none">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                  <CropAdvisorForm />
                </div>
              </TabsContent>

              <TabsContent value="detect" className="m-0 focus-visible:outline-none">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                  <AIDetectionForm />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Seasonal Tips */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-100 rounded-2xl">
                <Lightbulb className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {t("service.cropAdvisory.seasonalTips")}
                </h2>
                <p className="text-slate-500 text-sm">{t("service.cropAdvisory.seasonalTipsSubtitle")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tips.map((tip, index) => {
                const Icon = tip.icon || Sun;
                return (
                  <div
                    key={index}
                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm card-hover relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${tip.color}`} />
                    <div className={`inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br ${tip.color} text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                      {t(`service.cropAdvisory.tips.${index}.title`) || tip.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {t(`service.cropAdvisory.tips.${index}.content`) || tip.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}