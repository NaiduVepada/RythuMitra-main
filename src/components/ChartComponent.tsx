"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ChartComponentProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: "bar" | "line";
}

export default function ChartComponent({
  title,
  description,
  data,
  type = "bar",
}: ChartComponentProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
              </div>
              <div className="relative w-full h-8 bg-secondary rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 flex items-center justify-end px-3"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {Math.round((item.value / maxValue) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Average</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {maxValue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Highest</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
