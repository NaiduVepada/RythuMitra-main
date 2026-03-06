import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-green-950 to-slate-950 text-white mt-auto">

      {/* Top Wave Divider */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 -mb-1 fill-green-50">
          <path d="M0,48 L1440,0 L1440,48 Z" />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-2.5 shadow-lg shadow-green-900/30">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white leading-none block">RythuMitra</span>
                <span className="text-[10px] text-green-400/80 font-medium tracking-widest uppercase">
                  Farmers Support Portal
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Empowering farmers with AI-powered technology, expert knowledge, and real-time resources for sustainable agriculture and better livelihoods.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-1">
              {[
                { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
                { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
                { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
              ].map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`p-2 bg-white/10 rounded-lg ${color} hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <Icon className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/crop-advisory", label: "Crop Advisory" },
                { href: "/irrigation", label: "Smart Irrigation" },
                { href: "/knowledge", label: "Knowledge Hub" },
                { href: "/farm-management", label: "Farm Management" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-green-400 transition-colors group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/market", label: "Market Prices" },
                { href: "/schemes", label: "Government Schemes" },
                { href: "/contact", label: "Contact Support" },
                { href: "/knowledge", label: "Video Tutorials" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm text-slate-300 hover:text-green-400 transition-colors group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
                <span>Agriculture Department,<br />New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a href="mailto:support@rythimitra.gov.in" className="hover:text-green-400 transition-colors">
                  support@rythimitra.gov.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-2">Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 text-xs px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:bg-white/15 transition-all"
                />
                <button className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-medium transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} RythuMitra – Farmers Support Portal. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-xs text-slate-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-slate-400 hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-xs text-slate-400 hover:text-green-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
