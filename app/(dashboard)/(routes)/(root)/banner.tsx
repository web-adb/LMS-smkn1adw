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
  const [ipAddress, setIpAddress] = useState<string>("Loading...");
  const [location, setLocation] = useState<string>("Loading location...");
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

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

  // Request geolocation permission
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission("granted");
          fetchLocationFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationPermission("denied");
          fetchIpBasedLocation();
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      fetchIpBasedLocation();
    }
  }, []);

  // Fetch location from coordinates
  const fetchLocationFromCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const country = data.address.country;
        setLocation(`${city ? city + ', ' : ''}${country}`);
        setWeather(prev => ({
          ...prev,
          city: city || "Lokasi Anda"
        }));
      }
    } catch (error) {
      console.error("Error fetching location from coordinates:", error);
      fetchIpBasedLocation();
    }
  };

  // Fallback to IP-based location
  const fetchIpBasedLocation = async () => {
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      setIpAddress(ipData.ip);

      const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const locationData = await locationResponse.json();
      
      if (locationData.city && locationData.country_name) {
        setLocation(`${locationData.city}, ${locationData.country_name}`);
        setWeather(prev => ({
          ...prev,
          city: locationData.city
        }));
      }
    } catch (error) {
      console.error("Error fetching IP data:", error);
      setIpAddress("Not available");
      setLocation("Location unknown");
    }
  };

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

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission("granted");
          fetchLocationFromCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationPermission("denied");
        }
      );
    }
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

          {/* IP Address Card */}
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm min-w-[180px]">
            <div className="text-sm font-medium opacity-80">IP & Lokasi</div>
            <div className="flex flex-col mt-1">
              <div className="text-xs font-mono truncate" title={ipAddress}>
                {ipAddress}
              </div>
              {locationPermission === "denied" ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestLocation();
                  }}
                  className="text-sm font-medium text-white/80 hover:text-white underline"
                >
                  Izinkan akses lokasi
                </button>
              ) : (
                <div className="text-sm font-medium truncate" title={location}>
                  {location}
                  {coordinates && (
                    <span className="text-xs block opacity-70">
                      {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              )}
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