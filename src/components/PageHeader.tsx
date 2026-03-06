import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  badge?: string;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  image,
  badge,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 py-20 px-4">
      {/* Background image overlay if provided */}
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-20 mix-blend-luminosity"
          priority
        />
      )}

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-green-200 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            {badge}
          </div>
        )}

        <div className="flex items-start gap-5">
          {Icon && (
            <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm border border-white/25 p-4 rounded-2xl shadow-xl mt-1">
              <Icon className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-white/75 max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom shine bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  );
}
