"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProblemCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  href: string;
  color?: string;
}

export default function ProblemCard({
  title,
  description,
  icon: Icon,
  image,
  href,
  color = "primary",
}: ProblemCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 p-2 bg-white rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Link href={href}>
          <Button variant="default" className="w-full group/btn">
            {t("common.learnMore") || "Learn More"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
