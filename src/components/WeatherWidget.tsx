"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Droplets, Wind, Sun, Thermometer } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  rainfall: number;
  location: string;
}

interface WeatherWidgetProps {
  data?: WeatherData;
}

export default function WeatherWidget({ data }: WeatherWidgetProps) {
  // Mock data if not provided
  const weatherData: WeatherData = data || {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    rainfall: 2.5,
    location: "Your Location",
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("rain")) return CloudRain;
    if (lower.includes("cloud")) return Cloud;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon(weatherData.condition);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WeatherIcon className="h-5 w-5 text-primary" />
          Weather Forecast
        </CardTitle>
        <p className="text-sm text-muted-foreground">{weatherData.location}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Thermometer className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-xs text-muted-foreground">Temperature</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{weatherData.humidity}%</p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Wind className="h-8 w-8 text-cyan-500" />
            <div>
              <p className="text-2xl font-bold">{weatherData.windSpeed}</p>
              <p className="text-xs text-muted-foreground">Wind (km/h)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg col-span-2 md:col-span-3">
            <CloudRain className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="text-2xl font-bold">{weatherData.rainfall} mm</p>
              <p className="text-xs text-muted-foreground">Expected Rainfall (7 days)</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm font-medium text-primary">
            💡 Irrigation Tip: Current conditions are ideal for drip irrigation. Consider watering early morning or late evening.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
