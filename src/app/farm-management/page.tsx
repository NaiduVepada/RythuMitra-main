"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ChartComponent from "@/components/ChartComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, TrendingUp, DollarSign, Package, Calendar, Wheat, Droplet, Users, Tractor, Settings, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Expense = { id: string; category: string; amount: number; description: string; date: string };
type Harvest = { id: string; crop: string; amountTons: number; revenuePerTon: number; date: string };
type Activity = { id: string; type: "Expense" | "Harvest"; title: string; date: string; amount?: number; yieldTons?: number };

const EXPENSE_CATEGORIES = [
  { value: "Seeds", labelKey: "farmManagement.cat.seeds", color: "#10b981", icon: Wheat },
  { value: "Fertilizers", labelKey: "farmManagement.cat.fertilizers", color: "#3b82f6", icon: Droplet },
  { value: "Labor", labelKey: "farmManagement.cat.labor", color: "#f59e0b", icon: Users },
  { value: "Equipment", labelKey: "farmManagement.cat.equipment", color: "#8b5cf6", icon: Tractor },
  { value: "Irrigation", labelKey: "farmManagement.cat.irrigation", color: "#06b6d4", icon: Settings },
];

const CROP_TYPES = [
  { value: "Wheat", labelKey: "market.crops.wheat", color: "#f59e0b", avgPrice: 21500 }, // ₹ per ton
  { value: "Rice", labelKey: "market.crops.rice", color: "#10b981", avgPrice: 28000 },
  { value: "Cotton", labelKey: "market.crops.cotton", color: "#3b82f6", avgPrice: 62000 },
  { value: "Vegetables", labelKey: "market.crops.vegetables", color: "#ef4444", avgPrice: 15000 },
];

import { useLanguage } from "@/contexts/LanguageContext";

export default function FarmManagementPage() {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", category: "Seeds", amount: 15000, description: "Wheat Seeds", date: "2024-10-15" },
    { id: "2", category: "Fertilizers", amount: 22000, description: "NPK", date: "2024-10-20" },
    { id: "3", category: "Labor", amount: 35000, description: "Sowing", date: "2024-10-22" },
    { id: "4", category: "Equipment", amount: 18000, description: "Tractor Rent", date: "2024-10-25" },
    { id: "5", category: "Irrigation", amount: 12000, description: "Water Bill", date: "2024-11-01" },
  ]);

  const [harvests, setHarvests] = useState<Harvest[]>([
    { id: "1", crop: "Wheat", amountTons: 4.5, revenuePerTon: 21500, date: "2024-10-28" },
    { id: "2", crop: "Rice", amountTons: 3.8, revenuePerTon: 28000, date: "2024-09-15" },
    { id: "3", crop: "Cotton", amountTons: 2.2, revenuePerTon: 62000, date: "2024-11-05" },
    { id: "4", crop: "Vegetables", amountTons: 1.6, revenuePerTon: 15000, date: "2024-11-10" },
  ]);

  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({ category: "", amount: 0, description: "", date: "" });

  const [isHarvestOpen, setIsHarvestOpen] = useState(false);
  const [newHarvest, setNewHarvest] = useState<Partial<Harvest>>({ crop: "", amountTons: 0, date: "" });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;

    setExpenses([...expenses, {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: Number(newExpense.amount),
      description: newExpense.description || "",
      date: newExpense.date
    }]);
    setNewExpense({ category: "", amount: 0, description: "", date: "" });
    setIsExpenseOpen(false);
  };

  const handleAddHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHarvest.crop || !newHarvest.amountTons || !newHarvest.date) return;

    const cropConfig = CROP_TYPES.find(c => c.value === newHarvest.crop);

    setHarvests([...harvests, {
      id: Date.now().toString(),
      crop: newHarvest.crop,
      amountTons: Number(newHarvest.amountTons),
      revenuePerTon: cropConfig?.avgPrice || 20000,
      date: newHarvest.date
    }]);
    setNewHarvest({ crop: "", amountTons: 0, date: "" });
    setIsHarvestOpen(false);
  };

  // Derived Stats
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalRevenue = useMemo(() => harvests.reduce((sum, h) => sum + (h.amountTons * h.revenuePerTon), 0), [harvests]);
  const netProfit = totalRevenue - totalExpenses;
  const totalYieldTons = useMemo(() => harvests.reduce((sum, h) => sum + h.amountTons, 0), [harvests]);

  // Chart Data Preparation
  const expenseChartData = useMemo(() => {
    const grouped = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return EXPENSE_CATEGORIES.map(cat => ({
      label: t(cat.labelKey),
      value: grouped[cat.value] || 0,
      color: cat.color
    })).filter(d => d.value > 0);
  }, [expenses, t]);

  const yieldChartData = useMemo(() => {
    const grouped = harvests.reduce((acc, h) => {
      acc[h.crop] = (acc[h.crop] || 0) + h.amountTons;
      return acc;
    }, {} as Record<string, number>);

    return CROP_TYPES.map(crop => ({
      label: t(crop.labelKey),
      value: parseFloat((grouped[crop.value] || 0).toFixed(2)),
      color: crop.color
    })).filter(d => d.value > 0);
  }, [harvests, t]);

  // Activity Timeline
  const recentActivities: Activity[] = useMemo(() => {
    const combined: Activity[] = [
      ...expenses.map(e => {
        const cat = EXPENSE_CATEGORIES.find(c => c.value === e.category);
        return {
          id: `e-${e.id}`,
          type: "Expense" as const,
          title: e.description || (cat ? t(cat.labelKey) : e.category),
          date: e.date,
          amount: e.amount
        };
      }),
      ...harvests.map(h => {
        const crop = CROP_TYPES.find(c => c.value === h.crop);
        const translatedCrop = crop ? t(crop.labelKey) : h.crop;
        return {
          id: `h-${h.id}`,
          type: "Harvest" as const,
          title: `${t("farmManagement.harvested")} ${translatedCrop}`,
          date: h.date,
          yieldTons: h.amountTons
        };
      })
    ];
    // Sort descending by date
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [expenses, harvests, t]);


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-green-200 selection:text-green-900">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2400')] opacity-[0.03] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <PageHeader
          title={t("service.farmManagement.title")}
          description={t("service.farmManagement.description")}
          icon={LineChart}
        />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* Overview Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-green-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t("farmManagement.totalRevenue")}
                  </CardTitle>
                  <div className="p-2.5 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-5 w-5 text-green-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight font-serif mt-2">
                    ₹{(totalRevenue / 100000).toFixed(2)}L
                  </p>
                  <p className="text-[11px] text-green-700 mt-2 font-bold flex items-center gap-1 bg-green-50 w-fit px-2 py-1 rounded-md">
                    <ArrowUpRight className="h-3 w-3 inline" />
                    {t("farmManagement.estimatedFromYields")}
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-red-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t("farmManagement.totalExpenses")}
                  </CardTitle>
                  <div className="p-2.5 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                    <DollarSign className="h-5 w-5 text-red-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight font-serif mt-2">
                    ₹{(totalExpenses / 100000).toFixed(2)}L
                  </p>
                  <p className="text-[11px] text-red-700 mt-2 font-bold flex items-center gap-1 bg-red-50 w-fit px-2 py-1 rounded-md">
                    <ArrowDownRight className="h-3 w-3 inline" />
                    {t("farmManagement.loggedExpenses")}
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t("farmManagement.netProfit")}
                  </CardTitle>
                  <div className="p-2.5 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="h-5 w-5 text-blue-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-3xl font-extrabold tracking-tight font-serif mt-2 ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {netProfit < 0 ? "-" : ""}₹{(Math.abs(netProfit) / 100000).toFixed(2)}L
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 font-bold flex items-center gap-1 bg-slate-100 w-fit px-2 py-1 rounded-md">
                    {t("farmManagement.revenueMinusExpenses")}
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-lg shadow-orange-900/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {t("farmManagement.totalYield")}
                  </CardTitle>
                  <div className="p-2.5 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                    <Package className="h-5 w-5 text-orange-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight font-serif mt-2 flex items-baseline gap-1">
                    {totalYieldTons.toFixed(1)} <span className="text-sm font-semibold text-slate-500 font-sans">{t("farmManagement.tons")}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 font-bold flex items-center gap-1 bg-slate-100 w-fit px-2 py-1 rounded-md">
                    {t("farmManagement.acrossAllCrops")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-xl shadow-slate-900/5 border-white/60 bg-white/70 backdrop-blur-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
                <CardHeader className="bg-white/60 backdrop-blur-md border-b border-slate-100/60 pb-5 relative z-10">
                  <CardTitle className="text-xl font-serif text-slate-800">{t("farmManagement.quickActions")}</CardTitle>
                  <CardDescription className="font-medium text-slate-500/80">{t("farmManagement.manageFarmRecords")}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 relative z-10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Record Expense Dialog */}
                    <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 h-16 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 hover:from-red-100 hover:to-orange-100 border border-red-200/60 shadow-[0_4px_14px_0_rgba(239,68,68,0.1)] flex items-center justify-center gap-3 rounded-2xl group hover:-translate-y-0.5 transition-all text-base py-0">
                          <div className="p-2 bg-red-100 text-red-600 rounded-xl group-hover:bg-red-200 transition-colors">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <span className="font-bold tracking-wide">{t("farmManagement.recordExpense")}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200 rounded-3xl shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-xl">{t("farmManagement.addNewExpense")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddExpense} className="space-y-5 pt-4">
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.category")}</Label>
                            <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                              <SelectTrigger className="rounded-xl h-12 bg-slate-50 focus:ring-green-500">
                                <SelectValue placeholder={t("farmManagement.selectCategory")} />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {EXPENSE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.amount")}</Label>
                            <Input className="rounded-xl h-12 bg-slate-50 focus-visible:ring-green-500" type="number" min="1" required value={newExpense.amount || ""} onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })} placeholder="e.g. 5000" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.date")}</Label>
                            <Input className="rounded-xl h-12 bg-slate-50 focus-visible:ring-green-500" type="date" required value={newExpense.date || ""} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.descriptionOptional")}</Label>
                            <Input className="rounded-xl h-12 bg-slate-50 focus-visible:ring-green-500" type="text" value={newExpense.description || ""} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} placeholder="e.g. Bought Urea" />
                          </div>
                          <Button type="submit" className="w-full mt-4 h-12 rounded-xl btn-primary-gradient shadow-lg font-bold text-base">{t("farmManagement.saveExpense")}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {/* Log Harvest Dialog */}
                    <Dialog open={isHarvestOpen} onOpenChange={setIsHarvestOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex-1 h-16 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/60 shadow-[0_4px_14px_0_rgba(16,185,129,0.1)] flex items-center justify-center gap-3 rounded-2xl group hover:-translate-y-0.5 transition-all text-base py-0">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-200 transition-colors">
                            <Package className="h-5 w-5" />
                          </div>
                          <span className="font-bold tracking-wide">{t("farmManagement.logHarvest")}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200 rounded-3xl shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-xl">{t("farmManagement.addHarvestRecord")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddHarvest} className="space-y-5 pt-4">
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.cropType")}</Label>
                            <Select value={newHarvest.crop} onValueChange={(v) => setNewHarvest({ ...newHarvest, crop: v })}>
                              <SelectTrigger className="rounded-xl h-12 bg-slate-50 focus:ring-green-500">
                                <SelectValue placeholder={t("farmManagement.selectCrop")} />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {CROP_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{t(c.labelKey)}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.yieldLabel")}</Label>
                            <Input className="rounded-xl h-12 bg-slate-50 focus-visible:ring-green-500" type="number" step="0.1" min="0.1" required value={newHarvest.amountTons || ""} onChange={(e) => setNewHarvest({ ...newHarvest, amountTons: Number(e.target.value) })} placeholder="e.g. 2.5" />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-semibold text-slate-700">{t("farmManagement.dateOfHarvest")}</Label>
                            <Input className="rounded-xl h-12 bg-slate-50 focus-visible:ring-green-500" type="date" required value={newHarvest.date || ""} onChange={(e) => setNewHarvest({ ...newHarvest, date: e.target.value })} />
                          </div>
                          <Button type="submit" className="w-full mt-4 h-12 rounded-xl btn-primary-gradient shadow-lg font-bold text-base">{t("farmManagement.saveHarvest")}</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="p-1 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-shadow duration-300">
                <ChartComponent
                  title={t("farmManagement.expenseBreakdown")}
                  description={t("farmManagement.expensesByCat")}
                  data={expenseChartData}
                />
              </div>
              <div className="p-1 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-shadow duration-300">
                <ChartComponent
                  title={t("farmManagement.cropYieldTons")}
                  description={t("farmManagement.productionByCrop")}
                  data={yieldChartData}
                />
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-xl shadow-slate-900/5 border-white/60 bg-white/70 backdrop-blur-xl overflow-hidden mt-6">
                <CardHeader className="border-b border-slate-100/80 bg-white/60 backdrop-blur-md pb-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 font-serif text-xl">
                      <div className="p-2 bg-slate-100 rounded-lg shadow-sm border border-slate-200/60">
                        <Calendar className="h-5 w-5 text-slate-600" />
                      </div>
                      {t("farmManagement.activityLog")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {recentActivities.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-6 w-6 opacity-40 text-slate-600" />
                      </div>
                      <p className="text-lg font-medium">{t("farmManagement.noActivities")}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100/60">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-5 bg-white/40 hover:bg-white/80 transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3.5 rounded-xl shadow-sm border group-hover:scale-110 transition-transform duration-300 ${activity.type === 'Expense' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-500 border-green-100'}`}>
                              {activity.type === 'Expense' ? <DollarSign className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 tracking-tight group-hover:text-green-700 transition-colors">{activity.title}</p>
                              <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                                {new Date(activity.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {activity.amount && (
                              <p className="font-black text-red-600 text-lg tracking-tight bg-red-50 px-3 py-1 rounded-lg border border-red-100 shadow-sm">-₹{activity.amount.toLocaleString()}</p>
                            )}
                            {activity.yieldTons && (
                              <p className="font-black text-green-600 text-lg tracking-tight bg-green-50 px-3 py-1 rounded-lg border border-green-100 shadow-sm">+{activity.yieldTons} tons</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
