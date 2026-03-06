"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Sprout,
    Droplets,
    BookOpen,
    TrendingUp,
    Landmark,
    ArrowRight,
    Leaf
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WelcomePage() {
    const { data: session, isPending } = useSession();
    const { t } = useLanguage();
    const router = useRouter();

    // Define features inside component to use translation hook
    const features = [
        {
            title: t("welcome.feature.cropAdvisory.title"),
            description: t("welcome.feature.cropAdvisory.desc"),
            icon: Sprout,
            href: "/crop-advisory",
            color: "bg-emerald-100 text-emerald-600",
            gradient: "from-emerald-500 to-green-600"
        },
        {
            title: t("welcome.feature.irrigation.title"),
            description: t("welcome.feature.irrigation.desc"),
            icon: Droplets,
            href: "/irrigation",
            color: "bg-blue-100 text-blue-600",
            gradient: "from-blue-500 to-cyan-600"
        },
        {
            title: t("welcome.feature.knowledge.title"),
            description: t("welcome.feature.knowledge.desc"),
            icon: BookOpen,
            href: "/knowledge",
            color: "bg-amber-100 text-amber-600",
            gradient: "from-amber-500 to-orange-600"
        },
        {
            title: t("welcome.feature.market.title"),
            description: t("welcome.feature.market.desc"),
            icon: TrendingUp,
            href: "/market",
            color: "bg-indigo-100 text-indigo-600",
            gradient: "from-indigo-500 to-blue-600"
        },
        {
            title: t("welcome.feature.schemes.title"),
            description: t("welcome.feature.schemes.desc"),
            icon: Landmark,
            href: "/schemes",
            color: "bg-rose-100 text-rose-600",
            gradient: "from-rose-500 to-red-600"
        }
    ];

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (isPending || !session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const firstName = session.user.name?.split(" ")[0] || "Farmer";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6"
                    >
                        <Leaf className="h-4 w-4" />
                        {t("welcome.title")}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-serif"
                    >
                        {t("welcome.greeting")}, {firstName}. <br />
                        <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            {t("welcome.question")}
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
                    >
                        {t("welcome.description")}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl -z-10 bg-slate-200" />
                            <Link href={feature.href} className="block h-full relative z-10 outline-none focus-visible:ring-4 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-2xl">
                                <div className="bg-white rounded-2xl p-8 h-full border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-[0.03] rounded-bl-full`} />

                                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed mb-8 flex-1">
                                        {feature.description}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-green-600 mt-auto transition-colors">
                                        {t("welcome.getStarted")}
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="group relative md:col-span-2 lg:col-span-1"
                    >
                        <Link href="/farm-management" className="block h-full relative z-10">
                            <div className="bg-gradient-to-br from-slate-900 to-green-950 rounded-2xl p-8 h-full border border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800')] opacity-10 bg-cover bg-center mix-blend-overlay" />

                                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                                    {t("welcome.farmManagement.title")}
                                </h3>

                                <p className="text-slate-300 leading-relaxed mb-8 flex-1 relative z-10">
                                    {t("welcome.farmManagement.description")}
                                </p>

                                <div className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold backdrop-blur-md transition-colors border border-white/10 mt-auto relative z-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900">
                                    {t("welcome.farmManagement.button")}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
