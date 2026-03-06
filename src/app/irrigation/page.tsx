"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import WeatherWidget from "@/components/WeatherWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Droplets, Calendar, Clock, AlertCircle, CheckCircle, TrendingDown, Percent, Wallet, Plus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function SmartIrrigationPage() {
  const [irrigationSchedule, setIrrigationSchedule] = useState([
    {
      day: "Monday",
      time: "6:00 AM",
      duration: "45 mins",
      zone: "Field A",
      status: "completed",
    },
    {
      day: "Tuesday",
      time: "6:00 AM",
      duration: "30 mins",
      zone: "Field B",
      status: "completed",
    },
    {
      day: "Wednesday",
      time: "6:00 AM",
      duration: "60 mins",
      zone: "Field A",
      status: "scheduled",
    },
    {
      day: "Thursday",
      time: "6:00 AM",
      duration: "45 mins",
      zone: "Field C",
      status: "scheduled",
    },
  ]);

  const [showAdjust, setShowAdjust] = useState(false);
  const [form, setForm] = useState({ day: "", time: "", duration: "", zone: "" });

  async function submitSchedule(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/irrigation/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save schedule");
      const newEntry = await res.json();
      setIrrigationSchedule((s) => [newEntry, ...s]);
      setShowAdjust(false);
      setForm({ day: "", time: "", duration: "", zone: "" });
      toast.success("Schedule updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not update schedule");
    }
  }

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.4 } }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-blue-200 selection:text-blue-900 bg-slate-50">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574621100236-d14fb1fb0273?q=80&w=2400')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <PageHeader
          title="Smart Irrigation"
          description="Optimize water usage with weather-based recommendations and intelligent scheduling"
          icon={Droplets}
        />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Irrigation Tips */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-blue-900/5 bg-gradient-to-br from-blue-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Water Saved</p>
                      <div className="bg-blue-100 p-2.5 rounded-xl shadow-sm"><TrendingDown className="h-5 w-5 text-blue-700" /></div>
                    </div>
                    <p className="text-4xl sm:text-5xl font-black text-slate-800 font-serif tracking-tight mb-2">2,450 <span className="text-xl text-slate-400 font-sans font-medium">L</span></p>
                    <p className="text-sm font-semibold text-blue-600/80 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">+12% from last month</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-emerald-900/5 bg-gradient-to-br from-emerald-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Efficiency</p>
                      <div className="bg-emerald-100 p-2.5 rounded-xl shadow-sm"><Percent className="h-5 w-5 text-emerald-700" /></div>
                    </div>
                    <p className="text-4xl sm:text-5xl font-black text-slate-800 font-serif tracking-tight mb-2">94<span className="text-xl text-slate-400 font-sans font-medium">%</span></p>
                    <p className="text-sm font-semibold text-emerald-600/80 bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100">Optimal Range</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-white/60 shadow-xl shadow-orange-900/5 bg-gradient-to-br from-orange-50 to-white/80 backdrop-blur-xl relative overflow-hidden group hover:-translate-y-1 transition-transform h-full">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -z-10 group-hover:scale-125 transition-transform" />
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">Cost Saved</p>
                      <div className="bg-orange-100 p-2.5 rounded-xl shadow-sm"><Wallet className="h-5 w-5 text-orange-700" /></div>
                    </div>
                    <p className="text-4xl sm:text-5xl font-black text-slate-800 font-serif tracking-tight mb-2"><span className="text-2xl text-slate-400 font-sans font-medium mr-1">₹</span>3,200</p>
                    <p className="text-sm font-semibold text-orange-600/80 bg-orange-50 inline-block px-3 py-1 rounded-full border border-orange-100">This month</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
              {/* Irrigation Schedule */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border-white/60 shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden h-full flex flex-col">
                  <CardHeader className="p-6 sm:p-8 border-b border-slate-100 bg-white/40">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-3">
                        <div className="bg-blue-100 p-2.5 rounded-xl shadow-sm">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        Automated Schedule
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setShowAdjust((v) => !v)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl font-bold hidden sm:flex"
                      >
                        {showAdjust ? 'Cancel Adjustment' : 'Adjust Schedule'}
                      </Button>
                    </div>
                    <CardDescription className="text-base text-slate-500 font-medium ml-14">
                      Intelligent watering schedule optimized for your primary crops and local weather.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8 flex-1">

                    <AnimatePresence>
                      {showAdjust && (
                        <motion.form
                          initial={{ opacity: 0, height: 0, scaleY: 0.9 }}
                          animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
                          exit={{ opacity: 0, height: 0, scaleY: 0.9 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={submitSchedule}
                          className="mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4 overflow-hidden origin-top"
                        >
                          <h4 className="font-bold text-blue-900 mb-2 flex items-center"><Plus className="h-4 w-4 mr-2" /> Add Custom Cycle</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="day" className="text-slate-600 font-semibold">Day</Label>
                              <Input id="day" className="rounded-xl border-slate-200 h-12 bg-white" placeholder="e.g. Friday" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="time" className="text-slate-600 font-semibold">Time</Label>
                              <Input id="time" type="time" className="rounded-xl border-slate-200 h-12 bg-white flex justify-center items-center" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="duration" className="text-slate-600 font-semibold">Duration (mins)</Label>
                              <Input id="duration" type="number" className="rounded-xl border-slate-200 h-12 bg-white" placeholder="45" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="zone" className="text-slate-600 font-semibold">Zone / Field</Label>
                              <Input id="zone" className="rounded-xl border-slate-200 h-12 bg-white" placeholder="e.g. Field A" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} required />
                            </div>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button type="submit" className="flex-1 sm:flex-none rounded-xl h-12 px-8 font-bold bg-blue-600 hover:bg-blue-700 shadow-md">Save Cycle</Button>
                            <Button type="button" variant="outline" onClick={() => setShowAdjust(false)} className="flex-1 sm:flex-none rounded-xl h-12 border-slate-200 hover:bg-slate-100">Cancel</Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="space-y-4">
                      {irrigationSchedule.map((schedule, index) => (
                        <div
                          key={index}
                          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all gap-4"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                              <Clock className="h-6 w-6 text-blue-600 group-hover:text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-lg mb-0.5">{schedule.day}</p>
                              <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 gap-2">
                                <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-700">{schedule.time}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                                <span className="flex items-center"><Droplets className="h-3 w-3 mr-1 text-blue-400" /> {schedule.duration}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                                <span className="text-slate-600">{schedule.zone}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center self-end sm:self-auto shrink-0 mt-2 sm:mt-0">
                            {schedule.status === "completed" ? (
                              <span className="flex items-center gap-1.5 font-bold text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl sm:px-4 sm:py-2 shadow-sm">
                                <CheckCircle className="h-4 w-4" />
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 font-bold text-sm text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl sm:px-4 sm:py-2 shadow-sm">
                                <AlertCircle className="h-4 w-4" />
                                Scheduled
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setShowAdjust((v) => !v)}
                      className="w-full mt-6 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl h-14 font-bold sm:hidden"
                    >
                      {showAdjust ? 'Cancel Adjustment' : 'Adjust Schedule'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Best Practices Side Bar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-white/60 shadow-xl shadow-slate-200/50 bg-gradient-to-b from-white to-emerald-50/50 backdrop-blur-xl rounded-3xl overflow-hidden h-full">
                  <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-green-600" />
                  <CardHeader className="p-6 sm:p-8">
                    <CardTitle className="text-2xl font-serif font-bold text-slate-800">Best Practices</CardTitle>
                    <CardDescription className="text-base font-medium text-slate-500">Tips for optimal water management & maximum yield.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8 pt-0">
                    <ul className="space-y-6">
                      <li className="group">
                        <div className="flex items-start gap-4">
                          <div className="bg-white shadow-sm border border-emerald-100 p-2.5 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">Early Morning Water</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                              Watering before 8 AM reduces evaporation and ensures better deep soil absorption.
                            </p>
                          </div>
                        </div>
                      </li>
                      <div className="w-full h-px bg-slate-200/60 ml-14" />

                      <li className="group">
                        <div className="flex items-start gap-4">
                          <div className="bg-white shadow-sm border border-emerald-100 p-2.5 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">Drip Systems</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                              Convert to drip lines to save up to 60% water compared to traditional flood methods.
                            </p>
                          </div>
                        </div>
                      </li>
                      <div className="w-full h-px bg-slate-200/60 ml-14" />

                      <li className="group">
                        <div className="flex items-start gap-4">
                          <div className="bg-white shadow-sm border border-emerald-100 p-2.5 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">Moisture Monitoring</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                              Use soil sensors in root zones to prevent crop stress from both over or under watering.
                            </p>
                          </div>
                        </div>
                      </li>
                      <div className="w-full h-px bg-slate-200/60 ml-14" />

                      <li className="group">
                        <div className="flex items-start gap-4">
                          <div className="bg-white shadow-sm border border-emerald-100 p-2.5 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-emerald-50 transition-all">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">Regular Maintenance</p>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                              Check emitters for blockages and inspect mainlines for leaks weekly.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-emerald-100/50">
                      <Button variant="ghost" className="w-full justify-between hover:bg-emerald-50 text-emerald-700 font-bold h-12 rounded-xl group/btn">
                        Read full irrigation guide
                        <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
