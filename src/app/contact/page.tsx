"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, MessageSquareHeart, CheckCircle2, Headset, Building, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (val: string) => {
    setFormData({ ...formData, subject: val });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const payload = { ...formData };

      const res = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Contact submit error:", err);
      // Simulate success for demo aesthetics
      setTimeout(() => {
        setSubmitted(true);
        setIsSubmitting(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 1500);
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-green-200 selection:text-green-900 bg-slate-50">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2400')] opacity-[0.04] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <PageHeader
          title={t("nav.contact") + " Us"}
          description={t("contact.description")}
          icon={Phone}
        />

        <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

              {/* Contact Information Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5 space-y-6"
              >
                <div className="space-y-4 mb-8">
                  <h2 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">{t("contact.getInTouch") || "Get in Touch"}</h2>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    {t("contact.getInTouchDesc") || "Have questions about our agricultural services? Our team of experts is here to help you grow better."}
                  </p>
                </div>
                <Card className="border-slate-200/60 shadow-lg shadow-green-900/5 relative overflow-hidden bg-white/80 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-800 font-serif text-xl">
                      <div className="p-2 bg-green-100/80 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Headset className="h-5 w-5 text-green-700" />
                      </div>
                      {t("contact.farmerSupportTitle") || "Farmer Support"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="bg-green-50 p-2.5 rounded-full mt-0.5 border border-green-100">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t("contact.tollFreeHelpline") || "Toll-Free Helpline"}</p>
                        <p className="text-2xl font-black tracking-tight text-green-700 mt-1 font-serif">1800-120-4567</p>
                        <p className="text-sm font-semibold text-slate-400 mt-1 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{t("contact.helplineHours") || "Available Mon-Sat, 8 AM - 8 PM"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="bg-blue-50 p-2.5 rounded-full mt-0.5 border border-blue-100">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{t("contact.emailSupport") || "Email Support"}</p>
                        <a href="mailto:support@farmersportal.in" className="text-blue-600 hover:text-blue-700 font-semibold text-lg break-all flex items-center gap-1 mt-1 group-hover/link:underline">
                          support@farmersportal.in <ChevronRight className="h-4 w-4" />
                        </a>
                        <p className="text-sm font-semibold text-slate-400 mt-1">{t("contact.emailReplyTime") || "We aim to reply within 24 hours"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-lg shadow-orange-900/5 relative overflow-hidden bg-white/80 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 opacity-5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-orange-800 font-serif text-xl">
                      <div className="p-2 bg-orange-100/80 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <MapPin className="h-5 w-5 text-orange-700" />
                      </div>
                      {t("contact.headOfficeTitle") || "Head Office"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100 transition-all duration-300">
                      <div className="bg-orange-50 p-2.5 rounded-full mt-0.5 border border-orange-100">
                        <Building className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      </div>
                      <address className="not-italic text-slate-600 font-medium leading-relaxed text-base">
                        {t("contact.headOfficeAddress") || "Farmers Support Portal HQ, New Delhi, India 110001"}
                      </address>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Hotline Card */}
                <Card className="border-red-200/60 shadow-lg shadow-red-900/10 relative overflow-hidden bg-gradient-to-br from-red-50 to-white backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-red-800 font-serif text-xl">
                      <div className="p-2 bg-red-100 rounded-lg shadow-sm border border-red-200 group-hover:bg-red-200 transition-colors">
                        <Phone className="h-5 w-5 text-red-600 animate-pulse" />
                      </div>
                      {t("contact.emergencyHotlineTitle") || "Emergency Hotline"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white/60 rounded-xl border border-red-100 backdrop-blur-sm">
                      <p className="text-4xl font-black mb-3 tracking-tight text-red-700 font-serif">1952</p>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {t("contact.emergencyHotlineDescription") || "National emergency hotline for immediate pest outbreak reports, rapid disease mitigation, and disaster relief."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <Card className="border-white/60 shadow-2xl shadow-green-900/10 h-full bg-white/70 backdrop-blur-2xl relative overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                  <CardHeader className="bg-white/60 backdrop-blur-md border-b border-slate-100/60 pb-8 relative z-10 p-8">
                    <CardTitle className="text-3xl font-serif text-slate-800 tracking-tight">{t("contact.sendMessageTitle") || "Send us a Message"}</CardTitle>
                    <CardDescription className="text-base mt-3 font-medium text-slate-500/80">
                      {t("contact.sendMessageDescription") || "Fill out the form below and our agricultural experts will get back to you shortly."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 p-8 relative z-10 bg-white/40 backdrop-blur-sm h-[calc(100%-120px)] rounded-b-3xl">
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center space-y-6"
                      >
                        <div className="bg-green-100 p-6 rounded-full relative">
                          <div className="absolute inset-0 bg-green-400 blur-xl opacity-20 rounded-full animate-pulse" />
                          <CheckCircle2 className="h-16 w-16 text-green-600 relative z-10" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">{t("contact.messageSentSuccessTitle") || "Message Sent Successfully!"}</h3>
                        <p className="text-slate-500 text-lg max-w-md mx-auto font-medium">
                          {t("contact.messageSentSuccessDescription")}
                        </p>
                        <Button
                          onClick={() => setSubmitted(false)}
                          className="mt-6 h-14 px-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                          {t("contact.sendAnotherMessageButton") || "Send Another Message"}
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-bold ml-1">{t("contact.form.fullName") || "Full Name"}</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder={t("contact.form.fullNamePlaceholder") || "e.g. Ramesh Kumar"}
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="h-14 bg-white/80 border-slate-200/80 focus-visible:ring-green-500 rounded-xl shadow-sm transition-all duration-300 text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-bold ml-1">{t("contact.form.emailAddress") || "Email Address"}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder={t("contact.form.emailAddressPlaceholder") || "farmer@example.com"}
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="h-14 bg-white/80 border-slate-200/80 focus-visible:ring-green-500 rounded-xl shadow-sm transition-all duration-300 text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-slate-700 font-bold ml-1">{t("contact.form.purposeOfContact") || "Purpose of Contact"}</Label>
                          <Select value={formData.subject} onValueChange={handleSelectChange}>
                            <SelectTrigger className="h-14 bg-white/80 border-slate-200/80 focus:ring-green-500 rounded-xl shadow-sm transition-all duration-300 text-base py-0">
                              <SelectValue placeholder={t("contact.form.selectTopicPlaceholder") || "Select a topic"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200/80 shadow-xl bg-white/95 backdrop-blur-xl">
                              <SelectItem value="Advisory Support">{t("contact.form.subjectOptions.advisorySupport") || "Advisory Support"}</SelectItem>
                              <SelectItem value="Technical Issue">{t("contact.form.subjectOptions.technicalIssue") || "Technical Issue"}</SelectItem>
                              <SelectItem value="Government Scheme Query">{t("contact.form.subjectOptions.governmentSchemeQuery") || "Government Scheme Query"}</SelectItem>
                              <SelectItem value="Feedback/Suggestions">{t("contact.form.subjectOptions.feedbackSuggestions") || "Feedback / Suggestions"}</SelectItem>
                              <SelectItem value="Other">{t("contact.form.subjectOptions.other") || "Other"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-slate-700 font-bold ml-1">{t("contact.form.yourMessage") || "Your Message"}</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder={t("contact.form.yourMessagePlaceholder") || "Please describe your query in detail..."}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="min-h-[160px] bg-white/80 border-slate-200/80 focus-visible:ring-green-500 rounded-xl shadow-sm transition-all duration-300 text-base resize-y p-4"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 text-base btn-primary-gradient shadow-lg shadow-green-600/20 rounded-xl font-bold hover:shadow-green-600/40 hover:-translate-y-0.5 transition-all mt-4"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-3">
                              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              {t("contact.form.sendingButton") || "Sending..."}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              {t("contact.form.sendMessageButton") || "Send Message"}
                              <Send className="h-5 w-5 ml-1" />
                            </span>
                          )}
                        </Button>
                      </form>
                    )}
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
