// components/banner.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSun, Sun, Droplet } from "lucide-react";

export const WelcomeBanner = () => {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: 28,
    condition: "Cerah",
    city: "Jakarta",
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Weather icon mapping
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "hujan":
        return <CloudRain className="h-5 w-5" />;
      case "cerah":
        return <Sun className="h-5 w-5" />;
      case "berawan":
        return <CloudSun className="h-5 w-5" />;
      case "lembab":
        return <Droplet className="h-5 w-5" />;
      default:
        return <Cloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6 text-white shadow-lg">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10"></div>

      <div className="relative z-10 space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            👋 Selamat datang kembali,{" "}
            {user?.fullName || user?.firstName || user?.username || "User"}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Senang bertemu denganmu lagi! Siap untuk melanjutkan perjalanan
            belajar hari ini?
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Date Card */}
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-[180px]">
            <div className="text-sm font-medium opacity-80">Hari Ini</div>
            <div className="text-lg font-semibold mt-1">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Time Card */}
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-[180px]">
            <div className="text-sm font-medium opacity-80">Jam Sekarang</div>
            <div className="text-2xl font-bold mt-1">
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Weather Card */}
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-[180px]">
            <div className="text-sm font-medium opacity-80">
              Cuaca {weather.city}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {getWeatherIcon(weather.condition)}
                <span className="text-lg font-semibold">{weather.temp}°C</span>
              </div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {weather.condition}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
