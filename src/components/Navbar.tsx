"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Menu, X, Leaf, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending, refetch } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = useMemo(() => {
    const publicLinks = [
      { href: "/", label: t("nav.home") },
      { href: "/knowledge", label: t("nav.knowledgeHub") },
      { href: "/market", label: t("nav.marketPrices") },
      { href: "/schemes", label: t("nav.govSchemes") },
      { href: "/contact", label: t("nav.contact") },
    ];

    if (session?.user) {
      // Return only essential links for logged-in users,
      // as they navigate to features via the Welcome dashboard.
      return [
        { href: "/", label: t("nav.home") },
        { href: "/welcome", label: "Welcome" },
      ];
    }

    return publicLinks;
  }, [t, session?.user]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    const { error } = await authClient.signOut({
      fetchOptions: { headers: { Authorization: `Bearer ${token}` } },
    });
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Logged out successfully");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/30 shadow-lg shadow-green-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-2.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Leaf className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text leading-none tracking-tight">
                RythuMitra
              </span>
              <p className="text-[10px] text-green-600/70 font-medium tracking-widest uppercase leading-none mt-0.5">
                Farmers Support Portal
              </p>
            </div>
            <span className="text-lg font-bold gradient-text sm:hidden">RythuMitra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(link.href)
                  ? "text-green-700 bg-green-50/80"
                  : "text-slate-600 hover:text-green-700 hover:bg-green-50/60"
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-green-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageSelector />
            {!isPending && (
              <>
                {session?.user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase() || "F"}
                      </div>
                      <span className="text-sm font-medium text-green-900 hidden xl:inline max-w-[120px] truncate">
                        {session.user.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">{t("nav.logout")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="font-medium text-green-700 hover:bg-green-50">
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        size="sm"
                        className="btn-primary-gradient text-white font-semibold rounded-lg px-5 shadow-md"
                      >
                        {t("nav.register")}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-green-50 hover:text-green-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="xl:hidden border-t border-green-100/60 bg-white/95 backdrop-blur-xl shadow-xl">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.href)
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-100 shadow-sm"
                  : "text-slate-600 hover:bg-green-50/60 hover:text-green-700"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 pb-1 border-t border-green-100 mt-2">
              {!isPending && (
                <>
                  {session?.user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                          {session.user.name?.[0]?.toUpperCase() || "F"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-900">{session.user.name}</p>
                          <p className="text-xs text-green-600">{session.user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { handleSignOut(); setIsOpen(false); }}
                        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("nav.logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full border-green-200 text-green-700">
                          {t("nav.login")}
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button size="sm" className="w-full btn-primary-gradient text-white">
                          {t("nav.register")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}