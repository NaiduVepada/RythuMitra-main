"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Search, Video, FileText, Download, ExternalLink,
  PlayCircle, Clock, Eye, Filter
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function KnowledgeHubPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "Crop Management", labelKey: "knowledgeHub.cat.cropManagement", count: 45, emoji: "🌾" },
    { name: "Pest Control", labelKey: "knowledgeHub.cat.pestControl", count: 32, emoji: "🐛" },
    { name: "Soil Care", labelKey: "knowledgeHub.cat.soilCare", count: 28, emoji: "🌱" },
    { name: "Modern Farming", labelKey: "knowledgeHub.cat.modernFarming", count: 24, emoji: "🚁" },
    { name: "Irrigation", labelKey: "knowledgeHub.cat.irrigation", count: 18, emoji: "💧" },
    { name: "Market Trends", labelKey: "knowledgeHub.cat.marketTrends", count: 19, emoji: "📈" },
  ];

  const allArticles = [
    {
      id: 0,
      category: "Crop Management",
      categoryKey: "knowledgeHub.cat.cropManagement",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&q=80",
    },
    {
      id: 1,
      category: "Pest Control",
      categoryKey: "knowledgeHub.cat.pestControl",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&q=80",
    },
    {
      id: 2,
      category: "Soil Care",
      categoryKey: "knowledgeHub.cat.soilCare",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80",
    },
    {
      id: 3,
      category: "Irrigation",
      categoryKey: "knowledgeHub.cat.irrigation",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&q=80",
    },
    {
      id: 4,
      category: "Modern Farming",
      categoryKey: "knowledgeHub.cat.modernFarming",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80",
    },
    {
      id: 5,
      category: "Market Trends",
      categoryKey: "knowledgeHub.cat.marketTrends",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80",
    },
  ];

  const allVideos = [
    {
      id: 0,
      category: "Irrigation",
      categoryKey: "knowledgeHub.cat.irrigation",
      duration: "10:12",
      views: "1.2M",
      thumbnail: "https://img.youtube.com/vi/Xej22GsLLQA/hqdefault.jpg",
      url: "https://youtu.be/Xej22GsLLQA?si=E6hx0TzPe6HWOX2U",
    },
    {
      id: 1,
      category: "Soil Care",
      categoryKey: "knowledgeHub.cat.soilCare",
      duration: "8:45",
      views: "2.4M",
      thumbnail: "https://img.youtube.com/vi/zy70DAaeFBI/hqdefault.jpg",
      url: "https://youtu.be/zy70DAaeFBI?si=eVDlLiyvEgQVC12W",
    },
    {
      id: 2,
      category: "Crop Management",
      categoryKey: "knowledgeHub.cat.cropManagement",
      duration: "6:30",
      views: "890K",
      thumbnail: "https://img.youtube.com/vi/XeNA6XdMoF8/hqdefault.jpg",
      url: "https://youtu.be/XeNA6XdMoF8?si=Y9x4jveO2T8DjJUI",
    },
    {
      id: 3,
      category: "Modern Farming",
      categoryKey: "knowledgeHub.cat.modernFarming",
      duration: "14:22",
      views: "3.1M",
      thumbnail: "https://img.youtube.com/vi/EyNLQgJopvU/hqdefault.jpg",
      url: "https://youtu.be/EyNLQgJopvU?si=5vTmijglNzvU2QaG",
    },
    {
      id: 4,
      category: "Pest Control",
      categoryKey: "knowledgeHub.cat.pestControl",
      duration: "9:05",
      views: "670K",
      thumbnail: "https://img.youtube.com/vi/hXlSicZE9jI/hqdefault.jpg",
      url: "https://youtu.be/hXlSicZE9jI?si=3tYt8Yzrulj2jN-o",
    },
    {
      id: 5,
      category: "Modern Farming",
      categoryKey: "knowledgeHub.cat.modernFarming",
      duration: "11:48",
      views: "1.8M",
      thumbnail: "https://img.youtube.com/vi/gfCEQgx4d-4/hqdefault.jpg",
      url: "https://youtu.be/gfCEQgx4d-4?si=YBn3is-GLn5RRXHd",
    },
  ];

  const filteredArticles = useMemo(() => allArticles.filter((a) => {
    const q = searchQuery.toLowerCase();
    const translatedTitle = t(`knowledgeHub.article.${a.id}.title`).toLowerCase();
    const translatedCat = t(a.categoryKey).toLowerCase();
    return (
      (!q || translatedTitle.includes(q) || translatedCat.includes(q)) &&
      (!selectedCategory || a.category === selectedCategory)
    );
  }), [searchQuery, selectedCategory, t]);

  const filteredVideos = useMemo(() => allVideos.filter((v) => {
    const q = searchQuery.toLowerCase();
    const translatedTitle = t(`knowledgeHub.video.${v.id}.title`).toLowerCase();
    const translatedCat = t(v.categoryKey).toLowerCase();
    return (
      (!q || translatedTitle.includes(q) || translatedCat.includes(q)) &&
      (!selectedCategory || v.category === selectedCategory)
    );
  }), [searchQuery, selectedCategory, t]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <PageHeader
        title={t("service.knowledgeHub.title")}
        description={t("service.knowledgeHub.description")}
        icon={BookOpen}
        image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80"
        badge={t("knowledgeHub.badge")}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Search + Filter Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder={t("service.knowledgeHub.searchPlaceholder")}
                className="pl-12 h-14 text-base rounded-2xl border-2 border-slate-200 focus-visible:border-green-400 focus-visible:ring-0 bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="h-14 px-6 rounded-2xl border-2 border-green-200 text-green-700 hover:bg-green-50 gap-2"
              >
                <Filter className="h-4 w-4" />
                {t("knowledgeHub.clearFilter")}
              </Button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="h-5 w-1.5 bg-green-500 rounded-full" />
              {t("knowledgeHub.browseByCategory")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-medium transition-all duration-200 text-sm ${selectedCategory === cat.name
                    ? "bg-green-700 border-green-700 text-white shadow-lg shadow-green-900/20 scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold text-xs leading-tight text-center">{t(cat.labelKey)}</span>
                  <span className={`text-xs ${selectedCategory === cat.name ? "text-green-200" : "text-slate-400"}`}>
                    {cat.count} {t("knowledgeHub.itemsCount")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="h-7 w-1.5 bg-green-500 rounded-full" />
                <FileText className="h-6 w-6 text-green-600" />
                {t("service.knowledgeHub.featuredArticles")}
                {selectedCategory && <span className="text-lg text-slate-400 font-medium">— {t(categories.find(c => c.name === selectedCategory)?.labelKey || "")}</span>}
              </h2>
              {filteredArticles.length === 0 && (
                <span className="text-sm text-slate-400">{t("knowledgeHub.noArticles")}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const title = t(`knowledgeHub.article.${article.id}.title`);
                const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                return (
                  <Link key={article.id} href={`/knowledge/${slug}`}>
                    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm card-hover cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t(article.categoryKey)}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                          {t(`knowledgeHub.article.${article.id}.excerpt`)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-green-600 group-hover:gap-2 transition-all">
                            {t("knowledgeHub.readArticle")}
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Video Tutorials */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-7 w-1.5 bg-red-500 rounded-full" />
              <PlayCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-black text-slate-900">
                {t("service.knowledgeHub.videoTutorials")}
              </h2>
            </div>

            {filteredVideos.length === 0 ? (
              <p className="text-center text-slate-400 py-12 bg-white rounded-3xl border border-slate-100">
                {t("knowledgeHub.noVideos")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((video) => {
                  const title = t(`knowledgeHub.video.${video.id}.title`);
                  return (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm card-hover flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={video.thumbnail}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/50 transition-colors duration-300">
                          <div className="bg-red-600 text-white rounded-full p-3.5 shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <PlayCircle className="h-7 w-7" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                          {video.duration}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <p className="font-bold text-slate-800 text-sm leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                          {title}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                            {t(video.categoryKey)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Eye className="h-3.5 w-3.5" />
                            {video.views} {t("service.knowledgeHub.views")}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-4 py-3 bg-red-50 border-t border-red-100 flex items-center justify-center gap-2 text-red-600 text-xs font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 rounded-b-3xl">
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t("knowledgeHub.watchOnYoutube")}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Downloadable Resources */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-blue-100 bg-white/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Download className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-blue-900">
                    {t("service.knowledgeHub.downloadableResources")}
                  </h3>
                  <p className="text-sm text-blue-700/70">
                    {t("service.knowledgeHub.resourcesDescription")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 0, title: "Crop Calendar 2024", size: "2.4 MB", color: "from-green-400 to-emerald-500" },
                { id: 1, title: "Fertilizer Application Guide", size: "1.8 MB", color: "from-blue-400 to-cyan-500" },
                { id: 2, title: "Pest Identification Chart", size: "3.2 MB", color: "from-amber-400 to-orange-500" },
                { id: 3, title: "Organic Farming Manual", size: "5.1 MB", color: "from-purple-400 to-violet-500" },
              ].map((doc) => {
                const translatedTitle = t(`knowledgeHub.res.${doc.id}.title`);
                return (
                  <a
                    key={doc.id}
                    href={`/resources/${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                    download
                    className="group bg-white rounded-2xl p-5 border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                  >
                    <div className={`bg-gradient-to-br ${doc.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{translatedTitle}</p>
                      <p className="text-xs text-blue-500 font-medium mt-0.5">PDF • {doc.size}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
