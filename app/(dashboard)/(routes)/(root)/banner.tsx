// components/banner.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSun, Sun, Droplet, Moon, Zap, Snowflake, CloudLightning } from "lucide-react";

export const WelcomeBanner = () => {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: 28,
    condition: "Cerah",
    city: "Jakarta",
  });
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggWeather, setEasterEggWeather] = useState({
    temp: "??",
    condition: "Misterius",
    icon: <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Easter egg click count
  useEffect(() => {
    if (clickCount >= 5) {
      setShowEasterEgg(true);
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
        setClickCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  // Get time-based gradient colors
  const getTimeBasedGradient = () => {
    const hours = currentTime.getHours();
    
    if (showEasterEgg) {
      return {
        from: "from-purple-500",
        to: "to-pink-500",
        darkFrom: "from-purple-700",
        darkTo: "to-pink-700",
        icon: <CloudLightning className="h-5 w-5 text-yellow-300 animate-bounce" />
      };
    } else if (hours >= 5 && hours < 10) {
      return {
        from: "from-amber-400",
        to: "to-sky-500",
        darkFrom: "from-amber-500",
        darkTo: "to-sky-600",
        icon: <Sun className="h-5 w-5 text-yellow-300" />
      };
    } else if (hours >= 10 && hours < 15) {
      return {
        from: "from-sky-400",
        to: "to-blue-500",
        darkFrom: "from-sky-500",
        darkTo: "to-blue-600",
        icon: <Sun className="h-5 w-5 text-amber-400" />
      };
    } else if (hours >= 15 && hours < 18) {
      return {
        from: "from-orange-400",
        to: "to-pink-500",
        darkFrom: "from-orange-500",
        darkTo: "to-pink-600",
        icon: <CloudSun className="h-5 w-5 text-amber-500" />
      };
    } else if (hours >= 18 && hours < 21) {
      return {
        from: "from-violet-500",
        to: "to-blue-700",
        darkFrom: "from-violet-600",
        darkTo: "to-blue-800",
        icon: <CloudSun className="h-5 w-5 text-purple-300" />
      };
    } else {
      return {
        from: "from-blue-900",
        to: "to-indigo-950",
        darkFrom: "from-gray-900",
        darkTo: "to-blue-950",
        icon: <Moon className="h-5 w-5 text-blue-200" />
      };
    }
  };

  const timeGradient = getTimeBasedGradient();

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
    if (showEasterEgg) {
      return (
        <div className="flex gap-1">
          <CloudLightning className="h-5 w-5 text-yellow-400 animate-pulse" />
          <Snowflake className="h-5 w-5 text-blue-300 animate-spin" />
          <Zap className="h-5 w-5 text-purple-400 animate-ping" />
        </div>
      );
    }
    
    switch (condition.toLowerCase()) {
      case "hujan":
        return <CloudRain className="h-5 w-5 text-blue-200" />;
      case "cerah":
        return timeGradient.icon;
      case "berawan":
        return <CloudSun className="h-5 w-5 text-gray-200" />;
      case "lembab":
        return <Droplet className="h-5 w-5 text-blue-300" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-300" />;
    }
  };

  const handleBannerClick = () => {
    setClickCount(prev => prev + 1);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${timeGradient.from} ${timeGradient.to} dark:${timeGradient.darkFrom} dark:${timeGradient.darkTo} p-6 text-white shadow-lg transition-colors duration-1000 cursor-pointer`}
      onClick={handleBannerClick}
    >
      {/* Easter Egg Elements */}
      {showEasterEgg && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold animate-pulse">
              🌩️✨⛄
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs animate-bounce">
            {5-clickCount} clicks left
          </div>
        </>
      )}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10"></div>

      <div className={`relative z-10 space-y-4 transition-opacity ${showEasterEgg ? 'opacity-0' : 'opacity-100'}`}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {currentTime.getHours() >= 5 && currentTime.getHours() < 12 ? "🌅" : 
             currentTime.getHours() >= 12 && currentTime.getHours() < 15 ? "☀️" :
             currentTime.getHours() >= 15 && currentTime.getHours() < 18 ? "🌇" : "🌙"} Selamat {getTimeOfDayGreeting(currentTime.getHours())},{" "}
            {user?.fullName || user?.firstName || user?.username || "User"}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {showEasterEgg ? "Anda menemukan cuaca rahasia! 🎉" : getTimeBasedMessage(currentTime.getHours())}
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
              Cuaca {showEasterEgg ? "Rahasia" : weather.city}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {getWeatherIcon(showEasterEgg ? "misterius" : weather.condition)}
                <span className="text-lg font-semibold">
                  {showEasterEgg ? easterEggWeather.temp : weather.temp}°C
                </span>
              </div>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                {showEasterEgg ? easterEggWeather.condition : weather.condition}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get time-based greeting
const getTimeOfDayGreeting = (hours: number) => {
  if (hours >= 5 && hours < 11) return "pagi";
  if (hours >= 11 && hours < 15) return "siang";
  if (hours >= 15 && hours < 18) return "sore";
  return "malam";
};

// Helper function to get time-based message
const getTimeBasedMessage = (hours: number) => {
  if (hours >= 5 && hours < 10) {
    return "Hari yang cerah! Semangat untuk memulai aktivitas hari ini!";
  } else if (hours >= 10 && hours < 15) {
    return "Waktunya produktif! Jangan lupa istirahat sejenak ya!";
  } else if (hours >= 15 && hours < 18) {
    return "Sore yang indah! Bagaimana progres hari ini?";
  } else if (hours >= 18 && hours < 22) {
    return "Malam yang tenang. Saatnya melepas lelah setelah hari yang panjang.";
  } else {
    return "Waktunya beristirahat. Jangan tidur terlalu larut ya!";
  }
};