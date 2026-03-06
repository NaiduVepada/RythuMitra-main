"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ScanSearch, UploadCloud, Image as ImageIcon, X,
    Leaf, Bug, CheckCircle2, AlertCircle, FlaskConical,
    Sprout, ShieldAlert, ShieldCheck, Sparkles,
    ChevronDown, ChevronUp, Shield, Info, Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* ─── Types ─────────────────────────────────────────────────── */
type Mode = "disease" | "pest";

type DiseasePrediction = {
    disease: string;
    confidence: number;
    causativeAgent: string;
    severity: string;
    symptoms: string[];
    treatments: string[];
    organicAlternatives: string[];
    culturalPractices: string[];
    prevention: string[];
};

type PestPrediction = {
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
    predictions: (DiseasePrediction | PestPrediction)[];
    imageUrl?: string;
    aiPowered?: boolean;
} | null;

/* ─── Helpers ────────────────────────────────────────────────── */
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
const isDisease = (p: DiseasePrediction | PestPrediction): p is DiseasePrediction => "disease" in p;

const DISEASE_TIPS = [
    { emoji: "🍃", labelKey: "aiDetection.tip.disease.1.label", hintKey: "aiDetection.tip.disease.1.hint" },
    { emoji: "🌿", labelKey: "aiDetection.tip.disease.2.label", hintKey: "aiDetection.tip.disease.2.hint" },
    { emoji: "🍅", labelKey: "aiDetection.tip.disease.3.label", hintKey: "aiDetection.tip.disease.3.hint" },
    { emoji: "🌱", labelKey: "aiDetection.tip.disease.4.label", hintKey: "aiDetection.tip.disease.4.hint" },
];
const PEST_TIPS = [
    { emoji: "🐛", labelKey: "aiDetection.tip.pest.1.label", hintKey: "aiDetection.tip.pest.1.hint" },
    { emoji: "🪲", labelKey: "aiDetection.tip.pest.2.label", hintKey: "aiDetection.tip.pest.2.hint" },
    { emoji: "🦟", labelKey: "aiDetection.tip.pest.3.label", hintKey: "aiDetection.tip.pest.3.hint" },
    { emoji: "🐜", labelKey: "aiDetection.tip.pest.4.label", hintKey: "aiDetection.tip.pest.4.hint" },
];

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function AIDetectionForm() {
    const { t } = useLanguage();
    const [mode, setMode] = useState<Mode>("disease");
    const [isLoading, setIsLoading] = useState(false);
    const [diagnosis, setDiagnosis] = useState<DiagnosisResult>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── File handling ── */
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
    const clearAll = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null); setPreviewUrl(null); setDiagnosis(null); setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    const switchMode = (m: Mode) => { setMode(m); clearAll(); };

    /* ── Analyze ── */
    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsLoading(true); setDiagnosis(null); setError(null);
        try {
            const formData = new FormData();
            formData.append("image", selectedFile);
            const endpoint = mode === "disease" ? "/api/predict/disease" : "/api/predict/pest";
            const res = await fetch(endpoint, { method: "POST", body: formData });
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

    /* ── Mode-dependent style config ── */
    const isDisMode = mode === "disease";
    const accentFrom = isDisMode ? "from-emerald-600 via-green-600 to-teal-700" : "from-green-700 via-lime-700 to-emerald-800";
    const accentBtn = isDisMode ? "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" : "from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700";
    const accentBorder = isDisMode ? "border-emerald-300" : "border-green-300";
    const scanBarClass = isDisMode ? "bg-emerald-400 shadow-[0_0_20px_4px_rgba(52,211,153,0.6)]" : "bg-green-400 shadow-[0_0_20px_4px_rgba(74,222,128,0.5)]";
    const scanIconColor = isDisMode ? "text-emerald-400" : "text-green-400";
    const barColor = isDisMode ? "bg-emerald-500" : "bg-green-500";
    const tipBg = isDisMode ? "bg-emerald-50 border-emerald-100" : "bg-green-50 border-green-100";
    const tipLabel = isDisMode ? "text-emerald-800" : "text-green-800";
    const tips = isDisMode ? DISEASE_TIPS : PEST_TIPS;

    /* ════════════════════════════════════════════════════════════ */
    return (
        <div className="max-w-4xl mx-auto">
            <Card className="border-emerald-100 shadow-xl overflow-hidden rounded-2xl">

                {/* ── Gradient Header ── */}
                <CardHeader className={`bg-gradient-to-br ${accentFrom} pb-8 pt-10 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="absolute rounded-full bg-white"
                                style={{ width: `${40 + i * 20}px`, height: `${40 + i * 20}px`, top: `${10 + i * 12}%`, left: `${5 + i * 15}%` }} />
                        ))}
                    </div>
                    <div className="relative z-10 text-center">
                        {/* Sub-badge */}
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-xs font-bold tracking-widest text-green-200 uppercase flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3" /> {t("aiDetection.badge")}
                            </span>
                        </div>
                        {/* Title */}
                        <CardTitle className="flex items-center justify-center gap-3 text-3xl md:text-4xl text-white font-bold tracking-tight mb-4">
                            {isDisMode ? <Leaf className="h-10 w-10 text-emerald-200" /> : <Bug className="h-10 w-10 text-green-200" />}
                            {t("aiDetection.title")}
                        </CardTitle>
                        <CardDescription className="text-green-100/90 text-base max-w-2xl mx-auto mb-6">
                            {t("aiDetection.description")}
                        </CardDescription>

                        {/* ── Mode Toggle ── */}
                        <div className="inline-flex bg-white/15 backdrop-blur-sm rounded-2xl p-1.5 gap-1">
                            <button
                                onClick={() => switchMode("disease")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${isDisMode ? "bg-white text-emerald-700 shadow-md" : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Leaf className="h-4 w-4" />
                                {t("aiDetection.tab.disease")}
                            </button>
                            <button
                                onClick={() => switchMode("pest")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${!isDisMode ? "bg-white text-green-700 shadow-md" : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                <Bug className="h-4 w-4" />
                                {t("aiDetection.tab.pest")}
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 md:p-10 bg-white">
                    {!previewUrl ? (
                        <div className="space-y-8">
                            {/* Tips panel */}
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">
                                    📸 {isDisMode ? t("aiDetection.tips.disease.title") : t("aiDetection.tips.pest.title")}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {tips.map((tip) => (
                                        <div key={tip.labelKey} className={`flex flex-col items-center gap-2 p-4 border rounded-xl text-center ${tipBg}`}>
                                            <span className="text-3xl">{tip.emoji}</span>
                                            <span className={`font-semibold text-sm ${tipLabel}`}>{t(tip.labelKey)}</span>
                                            <span className="text-xs text-slate-500">{t(tip.hintKey)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upload zone */}
                            <div
                                className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[260px] cursor-pointer
                  ${isDragging ? "border-emerald-500 bg-emerald-50/60 scale-[1.02]" : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"}`}
                                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                <div className="bg-emerald-100 text-emerald-600 p-5 rounded-full mb-5 shadow-sm">
                                    <UploadCloud className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-800 mb-3">{t("aiDetection.upload.title")}</h3>
                                <p className="text-slate-500 mb-7 max-w-sm text-base">
                                    {isDisMode ? t("aiDetection.upload.disease.hint") : t("aiDetection.upload.pest.hint")}
                                </p>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg h-13 px-8 rounded-full">
                                    <ImageIcon className="w-5 h-5 mr-2" /> {t("aiDetection.upload.button")}
                                </Button>
                                <p className="text-xs text-slate-400 mt-3">{t("aiDetection.upload.formats")}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Preview */}
                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                                <div className="relative h-[400px] w-full flex items-center justify-center p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl shadow-sm" />

                                    {isLoading && (
                                        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none rounded-3xl">
                                            <div className={`w-full h-1 absolute top-0 animate-scan ${scanBarClass}`} />
                                            <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px]" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                <div className="bg-slate-900/90 text-white px-8 py-4 rounded-full flex items-center gap-4 backdrop-blur-md shadow-2xl">
                                                    <ScanSearch className={`w-6 h-6 animate-pulse ${scanIconColor}`} />
                                                    <span className="font-semibold tracking-wide text-lg">
                                                        {isDisMode ? t("aiDetection.scanning.disease") : t("aiDetection.scanning.pest")}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    {[0, 1, 2].map(i => (
                                                        <div key={i} className={`w-2 h-2 rounded-full animate-bounce ${barColor}`}
                                                            style={{ animationDelay: `${i * 0.15}s` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!isLoading && !diagnosis && (
                                        <button onClick={clearAll}
                                            className="absolute top-5 right-5 bg-white/95 text-slate-700 hover:text-red-500 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
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
                                    <Button variant="outline" onClick={clearAll} disabled={isLoading}
                                        className="w-1/4 h-16 text-lg rounded-2xl border-2">
                                        {t("aiDetection.button.cancel")}
                                    </Button>
                                    <Button onClick={handleAnalyze} disabled={isLoading}
                                        className={`flex-1 bg-gradient-to-r ${accentBtn} text-white text-xl h-16 rounded-2xl shadow-lg active:scale-[0.98] gap-3`}>
                                        {!isLoading && <Sparkles className="w-6 h-6" />}
                                        {isLoading
                                            ? t("aiDetection.button.analyzing")
                                            : isDisMode ? t("aiDetection.button.disease") : t("aiDetection.button.pest")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═════ RESULTS ═════ */}
                    {diagnosis && (
                        <div className="mt-8 space-y-5 animate-in slide-in-from-bottom-8 fade-in duration-700">

                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle2 className={`w-6 h-6 ${isDisMode ? "text-emerald-600" : "text-green-600"}`} />
                                    {isDisMode ? t("aiDetection.result.disease.title") : t("aiDetection.result.pest.title")}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 ${diagnosis.aiPowered
                                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                        }`}>
                                        <Sparkles className="w-3 h-3" />
                                        {diagnosis.aiPowered ? t("aiDetection.badge.gemini") : t("aiDetection.badge.smart")}
                                    </span>
                                    <button onClick={clearAll}
                                        className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center gap-1">
                                        <X className="w-3 h-3" /> {t("aiDetection.button.reset")}
                                    </button>
                                </div>
                            </div>

                            {/* Prediction cards */}
                            <div className="space-y-3">
                                {diagnosis.predictions.map((pred, idx) => {
                                    const sev = SEVERITY_CONFIG[pred.severity] || SEVERITY_CONFIG.Moderate;
                                    const isExp = expandedIdx === idx;
                                    const confPct = Math.round(pred.confidence * 100);
                                    const dis = isDisease(pred);
                                    const name = dis ? pred.disease : pred.pest;
                                    const sub = dis ? pred.causativeAgent : pred.scientificName;
                                    const spread = !dis ? (pred as PestPrediction).spreadRisk : undefined;

                                    return (
                                        <div key={idx} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isExp ? `${accentBorder} shadow-lg` : "border-slate-200 hover:border-emerald-200"
                                            }`}>
                                            {/* Header row */}
                                            <button className="w-full text-left p-5 flex items-center gap-4"
                                                onClick={() => setExpandedIdx(isExp ? -1 : idx)}>
                                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? (isDisMode ? "bg-emerald-600" : "bg-green-600") + " text-white" : "bg-slate-100 text-slate-600"
                                                    }`}>{idx + 1}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-bold text-slate-800 text-lg">{name}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} ${sev.border} border`}>
                                                            {pred.severity}
                                                        </span>
                                                        {spread && (
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SPREAD_CONFIG[spread]?.bg} ${SPREAD_CONFIG[spread]?.color}`}>
                                                                Spread: {spread}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-0.5 italic">{sub}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? barColor : "bg-slate-400"}`}
                                                                style={{ width: `${confPct}%` }} />
                                                        </div>
                                                        <span className={`text-sm font-bold shrink-0 ${idx === 0 ? (isDisMode ? "text-emerald-700" : "text-green-700") : "text-slate-600"}`}>
                                                            {confPct}%
                                                        </span>
                                                    </div>
                                                </div>
                                                {isExp ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                                            </button>

                                            {/* Expanded details */}
                                            {isExp && (
                                                <div className="border-t border-slate-100 p-5 space-y-5 bg-slate-50/50">
                                                    {/* Symptoms / Damage */}
                                                    {dis ? (
                                                        pred.symptoms?.length > 0 && (
                                                            <InfoSection icon={<Info className="w-4 h-4 text-orange-500" />} label={t("aiDetection.result.symptoms")}>
                                                                {pred.symptoms.map((s, i) => <BulletItem key={i} color="text-orange-400">{s}</BulletItem>)}
                                                            </InfoSection>
                                                        )
                                                    ) : (
                                                        (pred as PestPrediction).damage?.length > 0 && (
                                                            <InfoSection icon={<AlertCircle className="w-4 h-4 text-red-500" />} label={t("aiDetection.result.damage")}>
                                                                {(pred as PestPrediction).damage.map((d, i) => <BulletItem key={i} color="text-red-400">{d}</BulletItem>)}
                                                            </InfoSection>
                                                        )
                                                    )}

                                                    <div className="grid md:grid-cols-2 gap-5">
                                                        {/* Chemical */}
                                                        <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/40">
                                                            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3 text-sm">
                                                                <FlaskConical className="w-4 h-4" /> {t("aiDetection.result.chemical")}
                                                            </h4>
                                                            {pred.treatments.map((tr, i) => <BulletItem key={i} color="text-blue-500">{tr}</BulletItem>)}
                                                        </div>

                                                        <div className="space-y-4">
                                                            {/* Organic */}
                                                            <div className="border border-green-100 rounded-xl p-4 bg-green-50/40">
                                                                <h4 className="font-bold text-green-900 flex items-center gap-2 mb-3 text-sm">
                                                                    <Sprout className="w-4 h-4" /> {t("aiDetection.result.organic")}
                                                                </h4>
                                                                {dis
                                                                    ? pred.organicAlternatives?.map((o, i) => <BulletItem key={i} color="text-green-500">{o}</BulletItem>)
                                                                    : (pred as PestPrediction).organicControl?.map((o, i) => <BulletItem key={i} color="text-green-500">{o}</BulletItem>)
                                                                }
                                                            </div>

                                                            {/* Natural enemies (pest only) */}
                                                            {!dis && (pred as PestPrediction).naturalEnemies?.length > 0 && (
                                                                <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/40">
                                                                    <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3 text-sm">
                                                                        <Info className="w-4 h-4" /> {t("aiDetection.result.natural")}
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {(pred as PestPrediction).naturalEnemies.map((ne, i) => (
                                                                            <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">{ne}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Cultural practices (disease only) */}
                                                    {dis && pred.culturalPractices?.length > 0 && (
                                                        <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/40">
                                                            <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-3 text-sm">
                                                                <ShieldAlert className="w-4 h-4" /> {t("aiDetection.result.cultural")}
                                                            </h4>
                                                            <div className="grid sm:grid-cols-2 gap-2">
                                                                {pred.culturalPractices.map((pr, i) => <BulletItem key={i} color="text-amber-500">{pr}</BulletItem>)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Prevention */}
                                                    {pred.prevention?.length > 0 && (
                                                        <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/40">
                                                            <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-3 text-sm">
                                                                <Shield className="w-4 h-4" /> {t("aiDetection.result.prevention")}
                                                            </h4>
                                                            <div className="grid sm:grid-cols-2 gap-2">
                                                                {pred.prevention.map((p, i) => <BulletItem key={i} color="text-purple-400">{p}</BulletItem>)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Button variant="outline" onClick={clearAll}
                                className={`w-full border-2 ${isDisMode ? "text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "text-green-700 border-green-200 hover:bg-green-50"} h-14 text-lg rounded-xl font-medium`}>
                                {isDisMode ? t("aiDetection.button.rescan.disease") : t("aiDetection.button.rescan.pest")}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s cubic-bezier(0.4,0,0.2,1) infinite; }
      `}} />
        </div>
    );
}

/* ─── Small reusable sub-components ─────────────────────────── */
function InfoSection({ icon, label, children }: {
    icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
    return (
        <div>
            <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
                {icon} {label}
            </h4>
            <ul className="space-y-1.5">{children}</ul>
        </div>
    );
}

function BulletItem({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 text-slate-700 text-sm">
            <span className={`${color} mt-0.5 shrink-0`}>•</span>
            <span>{children}</span>
        </li>
    );
}
