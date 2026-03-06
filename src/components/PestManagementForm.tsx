"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ScanSearch, UploadCloud, Image as ImageIcon, X, Bug,
  ShieldCheck, CheckCircle2, AlertCircle, Sparkles,
  ChevronDown, ChevronUp, Zap, Shield, Info
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Prediction = {
  pest: string;
  scientificName: string;
  confidence: number;
  severity: string;
  spreadRisk: string;
  damage: string[];
  treatments: string[];
  organicControl: string[];
  prevention: string[];
  naturalEnemies: string[];
};

type DiagnosisResult = {
  predictions: Prediction[];
  imageUrl?: string;
  aiPowered?: boolean;
} | null;

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Low: { color: "text-green-700", bg: "bg-green-100", border: "border-green-200" },
  Moderate: { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200" },
  High: { color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200" },
  Critical: { color: "text-red-700", bg: "bg-red-100", border: "border-red-200" },
};

const SPREAD_CONFIG: Record<string, { color: string; bg: string }> = {
  Low: { color: "text-blue-700", bg: "bg-blue-100" },
  Medium: { color: "text-yellow-700", bg: "bg-yellow-100" },
  High: { color: "text-red-700", bg: "bg-red-100" },
};

const SAMPLE_TIPS = [
  { label: "On Leaves", hint: "Pests feeding on leaves", emoji: "🐛" },
  { label: "Stem/Bark", hint: "Borers or stem pests", emoji: "🪲" },
  { label: "Soil/Roots", hint: "Soil-dwelling pests", emoji: "🦟" },
  { label: "Fruit/Seed", hint: "Fruit-feeding insects", emoji: "🐜" },
];

export default function PestManagementForm() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith("image/")) { alert("Please upload an image file."); return; }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null); setError(null); setExpandedIdx(0);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelected(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null); setPreviewUrl(null); setDiagnosis(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true); setDiagnosis(null); setError(null);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const res = await fetch("/api/predict/pest", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDiagnosis(data);
      setExpandedIdx(0);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-green-100 shadow-xl overflow-hidden rounded-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-br from-green-700 via-lime-700 to-emerald-800 pb-8 pt-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ width: `${30 + i * 25}px`, height: `${30 + i * 25}px`, top: `${15 + i * 15}%`, right: `${5 + i * 12}%`, opacity: 0.5 }} />
            ))}
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-widest text-green-200 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI-Powered Pest Intelligence
              </span>
            </div>
            <CardTitle className="flex items-center justify-center gap-3 text-3xl md:text-4xl text-white text-center font-bold tracking-tight">
              <Bug className="h-10 w-10 text-green-200" />
              {t("pestForm.cardTitle")}
            </CardTitle>
            <CardDescription className="text-green-100/90 text-lg text-center max-w-2xl mx-auto mt-4">
              {t("pestForm.cardDescription")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-10 bg-white">
          {!previewUrl ? (
            <div className="space-y-8">
              {/* Sample tips */}
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
                  📸 Best Photo Types for Accurate Pest Detection
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SAMPLE_TIPS.map((tip) => (
                    <div key={tip.label} className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                      <span className="text-3xl">{tip.emoji}</span>
                      <span className="font-semibold text-green-800 text-sm">{tip.label}</span>
                      <span className="text-xs text-slate-500">{tip.hint}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload zone */}
              <div
                className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[280px] cursor-pointer
                  ${isDragging ? "border-green-500 bg-green-50/60 scale-[1.02] shadow-inner" : "border-slate-300 hover:border-green-400 hover:bg-slate-50"}`}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" id="pest-image-upload" />
                <div className="bg-green-100 text-green-600 p-5 rounded-full mb-6 shadow-sm">
                  <UploadCloud className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-3">{t("pestForm.upload.title")}</h3>
                <p className="text-slate-500 mb-8 max-w-sm text-lg">{t("pestForm.upload.description")}</p>
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md text-lg h-14 px-8 rounded-full transition-transform active:scale-95">
                  <ImageIcon className="w-6 h-6 mr-2" />
                  {t("pestForm.upload.button")}
                </Button>
                <p className="text-xs text-slate-400 mt-4">Supports: JPG, PNG, WEBP, HEIC</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <div className="relative h-[400px] w-full flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Pest preview" className="max-h-full max-w-full object-contain rounded-xl shadow-sm" />

                  {isLoading && (
                    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none rounded-3xl">
                      <div className="w-full h-1 bg-green-400 shadow-[0_0_20px_4px_rgba(52,211,153,0.6)] absolute top-0 animate-scan" />
                      <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="bg-slate-900/90 text-white px-8 py-4 rounded-full flex items-center gap-4 backdrop-blur-md shadow-2xl">
                          <ScanSearch className="w-6 h-6 animate-pulse text-green-400" />
                          <span className="font-semibold tracking-wide text-lg text-green-50">Identifying pest with Gemini AI...</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLoading && !diagnosis && (
                    <button onClick={clearImage}
                      className="absolute top-6 right-6 bg-white/95 text-slate-700 hover:text-red-500 hover:bg-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {!diagnosis && !error && (
                <div className="flex gap-4">
                  <Button variant="outline" onClick={clearImage} disabled={isLoading}
                    className="w-1/4 h-16 text-lg rounded-2xl border-2 hover:bg-slate-50">
                    {t("pestForm.button.cancel")}
                  </Button>
                  <Button onClick={handleAnalyze} disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white text-xl h-16 rounded-2xl shadow-lg active:scale-[0.98] gap-3">
                    {!isLoading && <Sparkles className="w-6 h-6" />}
                    {isLoading ? t("pestForm.button.analyzing") : "Identify Pest with AI"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ===== AI RESULTS ===== */}
          {diagnosis && (
            <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  {t("pestForm.result.title")}
                </h3>
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 ${diagnosis.aiPowered ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                  <Sparkles className="w-3 h-3" />
                  {diagnosis.aiPowered ? "Gemini AI" : "Smart Analysis"}
                </span>
              </div>

              {/* Prediction cards */}
              <div className="space-y-3">
                {diagnosis.predictions.map((pred, idx) => {
                  const sev = SEVERITY_CONFIG[pred.severity] || SEVERITY_CONFIG.Moderate;
                  const spread = SPREAD_CONFIG[pred.spreadRisk] || SPREAD_CONFIG.Medium;
                  const isExpanded = expandedIdx === idx;
                  const confPct = Math.round(pred.confidence * 100);

                  return (
                    <div key={idx} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? "border-green-300 shadow-lg" : "border-slate-200 hover:border-green-200"}`}>
                      <button
                        className="w-full text-left p-5 flex items-center gap-4 cursor-pointer"
                        onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
                      >
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-lg">{pred.pest}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} ${sev.border} border`}>
                              {pred.severity}
                            </span>
                            {pred.spreadRisk && (
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${spread.bg} ${spread.color}`}>
                                Spread: {pred.spreadRisk}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5 italic">{pred.scientificName}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? "bg-green-500" : "bg-slate-400"}`}
                                style={{ width: `${confPct}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold shrink-0 ${idx === 0 ? "text-green-700" : "text-slate-600"}`}>{confPct}%</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 p-5 space-y-6 bg-slate-50/50">
                          {/* Damage */}
                          {pred.damage?.length > 0 && (
                            <div>
                              <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
                                <AlertCircle className="w-4 h-4 text-red-500" /> Damage & Impact
                              </h4>
                              <ul className="space-y-1.5">
                                {pred.damage.map((d, i) => (
                                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                    <span className="text-red-400 mt-0.5 shrink-0">•</span>{d}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Chemical treatments */}
                            <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/40">
                              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3 text-sm">
                                <Zap className="w-4 h-4" /> Chemical Control
                              </h4>
                              <ul className="space-y-2">
                                {pred.treatments.map((tr, i) => (
                                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                    <span className="text-blue-500 mt-0.5 shrink-0">•</span>{tr}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-4">
                              {/* Organic */}
                              <div className="border border-green-100 rounded-xl p-4 bg-green-50/40">
                                <h4 className="font-bold text-green-900 flex items-center gap-2 mb-3 text-sm">
                                  <ShieldCheck className="w-4 h-4" /> Organic Control
                                </h4>
                                <ul className="space-y-1.5">
                                  {pred.organicControl?.map((o, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                      <span className="text-green-500 mt-0.5 shrink-0">•</span>{o}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {/* Natural enemies */}
                              {pred.naturalEnemies?.length > 0 && (
                                <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/40">
                                  <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3 text-sm">
                                    <Info className="w-4 h-4" /> Natural Enemies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {pred.naturalEnemies.map((ne, i) => (
                                      <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">{ne}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Prevention */}
                          {pred.prevention?.length > 0 && (
                            <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/40">
                              <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-3 text-sm">
                                <Shield className="w-4 h-4" /> Prevention Strategies
                              </h4>
                              <div className="grid sm:grid-cols-2 gap-2">
                                {pred.prevention.map((p, i) => (
                                  <div key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                    <span className="text-purple-400 mt-0.5 shrink-0">•</span>{p}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button variant="outline" onClick={clearImage}
                className="w-full text-green-700 border-2 border-green-200 hover:bg-green-50 h-14 text-lg rounded-xl font-medium">
                🔍 {t("pestForm.button.scanAnother")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}} />
    </div>
  );
}
