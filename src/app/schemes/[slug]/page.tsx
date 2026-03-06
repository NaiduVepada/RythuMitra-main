"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SCHEMES: Record<string, { title: string; subtitle: string; description: string; eligibility: string; benefit: string; category: string }> = {
  "pm-kisan": {
    title: "PM-KISAN",
    subtitle: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to farmer families in three equal installments. The objective is to supplement the financial needs of all landholding farmers' families in procuring various inputs to ensure proper crop health and appropriate yields, commensurate with the anticipated farm income.",
    eligibility: "All landholding farmer families",
    benefit: "₹6,000/year",
    category: "Financial Support"
  },
  "kcc": {
    title: "KCC",
    subtitle: "Kisan Credit Card",
    description: "Provides adequate and timely credit support for agriculture needs at concessional interest rates. The scheme aims to save farmers from high interest rates of money lenders and provide them credit for agriculture use. It covers post-harvest expenses, produce marketing loans, and working capital for maintenance of farm assets.",
    eligibility: "Individual farmers, tenant farmers, SHGs",
    benefit: "Up to ₹3 lakhs at 4% interest",
    category: "Credit/Loan"
  },
  "pmfby": {
    title: "PMFBY",
    subtitle: "Pradhan Mantri Fasal Bima Yojana",
    description: "Provides a comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers. The scheme covers localized calamities, post-harvest losses, and unseasonal rains.",
    eligibility: "All farmers growing notified crops",
    benefit: "Crop Insurance Coverage",
    category: "Insurance"
  }
};

export default function SchemePage({ params }: { params: { slug: string } }) {
  const scheme = SCHEMES[params.slug];

  if (!scheme) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 py-20 px-4 flex items-center justify-center">
          <Card className="max-w-md text-center p-8 bg-white shadow-xl rounded-3xl">
            <Building2 className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Scheme Not Found</h2>
            <p className="text-slate-500 mb-6">The scheme you are looking for does not exist or has been removed.</p>
            <Link href="/schemes">
              <Button className="rounded-xl px-8 h-12 font-bold bg-green-600 hover:bg-green-700">Return to Schemes</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-green-200 selection:text-green-900 bg-slate-50">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2400')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Custom Minimal Header */}
        <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex items-center">
            <Link href="/schemes" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-green-700 transition-colors group">
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Schemes
            </Link>
          </div>
        </div>

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-white/60 bg-white/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden relative">
                {/* Decorative header block */}
                <div className="h-32 sm:h-48 bg-gradient-to-r from-emerald-600 to-teal-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c50ce?q=80&w=2000')] opacity-20 bg-cover bg-center mix-blend-overlay" />
                  <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none -rotate-12 scale-150">
                    <Building2 className="h-48 w-48 text-white" />
                  </div>
                </div>

                <div className="px-6 sm:px-12 pb-12">
                  <div className="flex flex-col md:flex-row gap-8 items-start -mt-12 sm:-mt-16 relative z-10">

                    {/* Icon floating up */}
                    <div className="h-24 w-24 sm:h-32 sm:w-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white shrink-0 p-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600 relative z-10" />
                    </div>

                    <div className="flex-1 pt-4 sm:pt-16">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-4 shadow-sm">
                        {scheme.category}
                      </span>
                      <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-800 tracking-tight mb-2">
                        {scheme.title}
                      </h1>
                      <p className="text-xl sm:text-2xl font-serif text-slate-500 italic">
                        {scheme.subtitle}
                      </p>
                    </div>

                  </div>

                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-2 space-y-8">
                      <section>
                        <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                          <ShieldCheck className="mr-2 h-6 w-6 text-emerald-600" />
                          Overview
                        </h3>
                        <div className="prose prose-slate prose-lg text-slate-600 leading-relax">
                          <p>{scheme.description}</p>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10" />
                        <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-2">Eligibility</h4>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <p className="font-semibold text-slate-700 text-lg leading-tight">{scheme.eligibility}</p>
                        </div>
                      </div>

                      <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-[100px] -z-10" />
                        <h4 className="font-bold text-emerald-600/70 uppercase tracking-widest text-xs mb-2">Benefit</h4>
                        <p className="font-black text-emerald-700 text-3xl tracking-tight">{scheme.benefit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 -mx-6 sm:-mx-12 -mb-12 p-6 sm:p-12 rounded-b-[2rem]">
                    <div className="flex-1 w-full sm:w-auto">
                      <p className="text-sm font-semibold text-slate-500 mb-1">Ready to start?</p>
                      <p className="font-bold text-slate-800">Apply for this scheme today.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <Button variant="outline" className="h-14 px-8 rounded-xl font-bold bg-white shadow-sm border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all w-full sm:w-auto">
                        Contact Support
                      </Button>
                      <a href={`https://gov.example/apply/${params.slug}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                        <Button className="h-14 px-8 rounded-xl font-bold text-md text-white shadow-lg shadow-emerald-600/20 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all hover:-translate-y-1 w-full">
                          Apply Now
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
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
