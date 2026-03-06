"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sprout,
  MapPin,
  Calendar,
  Droplets,
  IndianRupee,
  History,
  Leaf,
  Maximize,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type FormData = {
  location: string;
  soilType: string;
  farmSize: string;
  season: string;
  irrigation: string;
  budget: string;
  previousCrops: string;
};

type StepId = "location" | "soil" | "size" | "season" | "water" | "budget" | "history";

const STEP_IDS: StepId[] = ["location", "soil", "size", "season", "water", "budget", "history"];

const STEP_ICONS: Record<StepId, React.ElementType> = {
  location: MapPin,
  soil: Leaf,
  size: Maximize,
  season: Calendar,
  water: Droplets,
  budget: IndianRupee,
  history: History,
};

export default function CropAdvisorForm() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [formData, setFormData] = useState<FormData>({
    location: "",
    soilType: "",
    farmSize: "",
    season: "",
    irrigation: "",
    budget: "",
    previousCrops: "",
  });

  const STEPS = STEP_IDS.map((id) => ({
    id,
    title: t(`cropAdvisor.step.${id}.title`),
    description: t(`cropAdvisor.step.${id}.description`),
    icon: STEP_ICONS[id],
  }));

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setRecommendation("");

    setTimeout(() => {
      setRecommendation(
        "Based on your inputs, we recommend planting wheat this season. The soil type and climate conditions in your region are favorable for wheat cultivation. Expected yield: 4-5 tons per hectare. Best planting time: October-November."
      );
      setIsLoading(false);
    }, 2000);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: return formData.location.trim().length > 0;
      case 1: return formData.soilType !== "";
      case 2: return formData.farmSize !== "" && parseFloat(formData.farmSize) > 0;
      case 3: return formData.season !== "";
      case 4: return formData.irrigation !== "";
      case 5: return formData.budget !== "" && parseFloat(formData.budget) > 0;
      default: return true;
    }
  };

  const CurrentIcon = STEPS[currentStep].icon;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-green-100 shadow-md">
        <CardHeader className="bg-green-50/50 border-b border-green-100 rounded-t-xl pb-6">
          <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
            <Sprout className="h-6 w-6 text-green-600" />
            {t("cropAdvisor.cardTitle")}
          </CardTitle>
          <CardDescription className="text-green-700/70 text-base">
            {t("cropAdvisor.cardDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left Column: Progress / Stepper */}
            <div className="w-full md:w-1/3 bg-slate-50 p-6 border-b md:border-b-0 md:border-r border-slate-200">
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500 mb-2">
                  <span>{t("cropAdvisor.step.label")} {currentStep + 1} {t("cropAdvisor.step.of")} {STEPS.length}</span>
                  <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="hidden md:flex flex-col space-y-6 relative ml-2">
                {/* Connecting Line */}
                <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-slate-200 z-0"></div>

                {STEPS.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="relative z-10 flex items-start gap-4">
                      <div
                        className={`mt-0.5 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-200
                          ${isActive ? 'bg-green-600 border-green-600 text-white' :
                            isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                              'bg-white border-slate-300 text-slate-400'}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${isActive ? 'text-green-800' : isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className="text-xs text-slate-500">{step.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Form Inputs */}
            <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between bg-white relative">
              <div className="space-y-6 flex-grow">
                {recommendation && currentStep === STEPS.length - 1 ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Sprout className="w-6 h-6 text-green-700" />
                      </div>
                      <h4 className="text-xl font-bold text-green-800">{t("cropAdvisor.recommendation.title")}</h4>
                    </div>
                    <p className="text-green-900 leading-relaxed text-lg">{recommendation}</p>
                    <Button
                      variant="outline"
                      className="mt-6 border-green-200 text-green-700 hover:bg-green-100"
                      onClick={() => {
                        setCurrentStep(0);
                        setRecommendation("");
                        setFormData({
                          location: "", soilType: "", farmSize: "", season: "", irrigation: "", budget: "", previousCrops: ""
                        });
                      }}
                    >
                      {t("cropAdvisor.button.startOver")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-green-100 rounded-lg text-green-700">
                        <CurrentIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-800">{STEPS[currentStep].title}</h3>
                        <p className="text-slate-500">{STEPS[currentStep].description}</p>
                      </div>
                    </div>

                    <div className="flex-grow py-4 animate-in slide-in-from-right-4 fade-in duration-300">
                      {/* Step 1: Location */}
                      {currentStep === 0 && (
                        <div className="space-y-3">
                          <Label htmlFor="location" className="text-lg">{t("cropAdvisor.label.location")}</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder={t("cropAdvisor.placeholder.location")}
                            className="text-lg py-6 focus-visible:ring-green-500"
                            autoFocus
                          />
                        </div>
                      )}

                      {/* Step 2: Soil Type */}
                      {currentStep === 1 && (
                        <div className="space-y-3">
                          <Label htmlFor="soil-type" className="text-lg">{t("cropAdvisor.label.soilType")}</Label>
                          <Select value={formData.soilType} onValueChange={(val) => handleChange("soilType", val)}>
                            <SelectTrigger id="soil-type" className="text-lg py-6 focus:ring-green-500 h-14">
                              <SelectValue placeholder={t("cropAdvisor.placeholder.soilType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clay" className="text-base py-3">{t("cropAdvisor.soil.clay")}</SelectItem>
                              <SelectItem value="loamy" className="text-base py-3">{t("cropAdvisor.soil.loamy")}</SelectItem>
                              <SelectItem value="sandy" className="text-base py-3">{t("cropAdvisor.soil.sandy")}</SelectItem>
                              <SelectItem value="silt" className="text-base py-3">{t("cropAdvisor.soil.silt")}</SelectItem>
                              <SelectItem value="peaty" className="text-base py-3">{t("cropAdvisor.soil.peaty")}</SelectItem>
                              <SelectItem value="chalky" className="text-base py-3">{t("cropAdvisor.soil.chalky")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Step 3: Farm Size */}
                      {currentStep === 2 && (
                        <div className="space-y-3">
                          <Label htmlFor="farm-size" className="text-lg">{t("cropAdvisor.label.farmSize")}</Label>
                          <Input
                            id="farm-size"
                            type="number"
                            value={formData.farmSize}
                            onChange={(e) => handleChange("farmSize", e.target.value)}
                            placeholder="e.g. 2.5"
                            min="0.1"
                            step="0.1"
                            className="text-lg py-6 focus-visible:ring-green-500"
                            autoFocus
                          />
                        </div>
                      )}

                      {/* Step 4: Season */}
                      {currentStep === 3 && (
                        <div className="space-y-3">
                          <Label htmlFor="season" className="text-lg">{t("cropAdvisor.label.season")}</Label>
                          <Select value={formData.season} onValueChange={(val) => handleChange("season", val)}>
                            <SelectTrigger id="season" className="text-lg py-6 focus:ring-green-500 h-14">
                              <SelectValue placeholder={t("cropAdvisor.placeholder.season")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kharif" className="text-base py-3">{t("cropAdvisor.season.kharif")}</SelectItem>
                              <SelectItem value="rabi" className="text-base py-3">{t("cropAdvisor.season.rabi")}</SelectItem>
                              <SelectItem value="zaid" className="text-base py-3">{t("cropAdvisor.season.zaid")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Step 5: Irrigation */}
                      {currentStep === 4 && (
                        <div className="space-y-3">
                          <Label htmlFor="irrigation" className="text-lg">{t("cropAdvisor.label.irrigation")}</Label>
                          <Select value={formData.irrigation} onValueChange={(val) => handleChange("irrigation", val)}>
                            <SelectTrigger id="irrigation" className="text-lg py-6 focus:ring-green-500 h-14">
                              <SelectValue placeholder={t("cropAdvisor.placeholder.irrigation")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes" className="text-base py-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> {t("cropAdvisor.irrigation.yes")}
                              </SelectItem>
                              <SelectItem value="limited" className="text-base py-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> {t("cropAdvisor.irrigation.limited")}
                              </SelectItem>
                              <SelectItem value="no" className="text-base py-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span> {t("cropAdvisor.irrigation.no")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Step 6: Budget */}
                      {currentStep === 5 && (
                        <div className="space-y-3">
                          <Label htmlFor="budget" className="text-lg">{t("cropAdvisor.label.budget")}</Label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                            <Input
                              id="budget"
                              type="number"
                              value={formData.budget}
                              onChange={(e) => handleChange("budget", e.target.value)}
                              placeholder={t("cropAdvisor.placeholder.budget")}
                              min="1000"
                              step="1000"
                              className="text-lg py-6 pl-10 focus-visible:ring-green-500"
                              autoFocus
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 7: Previous Crops */}
                      {currentStep === 6 && (
                        <div className="space-y-3">
                          <Label htmlFor="previous-crops" className="text-lg">{t("cropAdvisor.label.previousCrops")}</Label>
                          <Textarea
                            id="previous-crops"
                            value={formData.previousCrops}
                            onChange={(e) => handleChange("previousCrops", e.target.value)}
                            placeholder={t("cropAdvisor.placeholder.previousCrops")}
                            className="text-base min-h-[120px] focus-visible:ring-green-500 resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Form Navigation Actions */}
              {!recommendation && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isLoading}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t("cropAdvisor.button.back")}
                  </Button>

                  {currentStep < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleNext}
                      disabled={!isCurrentStepValid()}
                      className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                    >
                      {t("cropAdvisor.button.next")}
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => handleSubmit()}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white min-w-[200px]"
                    >
                      {isLoading ? t("cropAdvisor.button.analyzing") : t("cropAdvisor.button.getSuggestions")}
                      {!isLoading && <Sprout className="w-5 h-5 ml-2" />}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
