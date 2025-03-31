// components/widgets-grid.tsx
"use client";

import { 
  Compass, List, Calendar, Trophy, Award, 
  Clock, MessageSquare, HelpCircle, Settings, 
  ChevronDown, ChevronUp, Sparkles, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Widget = {
  icon: any;
  label: string;
  href: string;
  color: string;
  bg: string;
  hover: string;
};

export const WidgetsGrid = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<{text: string; relevantWidget?: number} | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<number | null>(null);

  const widgets: Widget[] = [
    {
      icon: Compass,
      label: "Jelajahi Kursus",
      href: "/search",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-800/30"
    },
    {
      icon: List,
      label: "Tugas Saya",
      href: "/tugas",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      hover: "hover:bg-emerald-100 dark:hover:bg-emerald-800/30"
    },
    {
      icon: Calendar,
      label: "Kalender",
      href: "/kalender",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/30",
      hover: "hover:bg-rose-100 dark:hover:bg-rose-800/30"
    },
    {
      icon: Trophy,
      label: "Peringkat Siswa",
      href: "/papan-peringkat",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-800/30"
    },
    {
      icon: Award,
      label: "Sertifikat Saya",
      href: "/sertifikat",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-800/30"
    },
    {
      icon: Clock,
      label: "Aktivitas",
      href: "/riwayat-aktivitas",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-900/30",
      hover: "hover:bg-cyan-100 dark:hover:bg-cyan-800/30"
    },
    {
      icon: MessageSquare,
      label: "Forum Diskusi",
      href: "/forum",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
      hover: "hover:bg-indigo-100 dark:hover:bg-indigo-800/30"
    },
    {
      icon: HelpCircle,
      label: "Pusat Bantuan",
      href: "/bantuan",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/30",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-800/30"
    },
    {
      icon: Settings,
      label: "Pengaturan Akun",
      href: "/pengaturan",
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-50 dark:bg-gray-800/30",
      hover: "hover:bg-gray-100 dark:hover:bg-gray-700/30"
    },
  ];

  // Simulate user interactions (in a real app, this would come from analytics)
  const simulateUserBehavior = () => {
    const now = Date.now();
    // Simulate that the user frequently checks assignments
    if (Math.random() > 0.7) {
      setLastInteraction(1); // Tugas Saya
    } 
    // Simulate occasional course browsing
    else if (Math.random() > 0.8) {
      setLastInteraction(0); // Jelajahi Kursus
    }
    // Simulate calendar check before weekends
    else if (new Date().getDay() >= 4 && Math.random() > 0.6) {
      setLastInteraction(2); // Kalender
    }
  };

  // Fetch AI suggestion from Gemini with context
  const fetchAiSuggestion = async () => {
    setIsLoadingSuggestion(true);
    simulateUserBehavior();

    try {
      const contextPrompt = lastInteraction !== null 
        ? `Pengguna sering mengakses ${widgets[lastInteraction].label} baru-baru ini. `
        : "Saya tidak memiliki data interaksi pengguna terbaru. ";

      const prompt = `
        Anda adalah asisten AI untuk platform LMS. Berikan satu saran yang sangat spesifik dan bermanfaat 
        berdasarkan konteks berikut dalam 1 kalimat pendek menggunakan bahasa Indonesia yang formal:
        
        ${contextPrompt}
        Widget yang tersedia: ${widgets.map(w => w.label).join(', ')}.
        
        Contoh saran yang baik:
        - "Anda memiliki 3 tugas yang belum dikerjakan dengan deadline minggu ini."
        - "Lihat kursus baru tentang Pemrograman Python yang sesuai dengan minat Anda."
        - "Jangan lupa untuk memeriksa Kalender untuk acara mendatang."
        - "Partisipasi Anda di Forum Diskusi masih rendah bulan ini."
        
        Jangan gunakan tanda kutip dalam respons.
        Buat saran yang spesifik dan actionable.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      const data = await response.json();
      const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (suggestionText) {
        // Find which widget this suggestion is most relevant to
        const relevantWidget = widgets.findIndex(widget => 
          suggestionText.toLowerCase().includes(widget.label.toLowerCase())
        );
        
        setAiSuggestion({
          text: suggestionText,
          relevantWidget: relevantWidget >= 0 ? relevantWidget : undefined
        });
      }
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion({
        text: "Sistem sedang mempelajari kebiasaan Anda untuk memberikan saran yang lebih personal."
      });
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  useEffect(() => {
    fetchAiSuggestion();
    const interval = setInterval(fetchAiSuggestion, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [lastInteraction]);

  const handleWidgetClick = (index: number) => {
    setLastInteraction(index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <motion.div 
        className="flex items-center justify-between cursor-pointer group mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.98 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
          <span>Menu Aplikasi</span>
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {isExpanded ? 'Sembunyikan' : 'Tampilkan Semua'}
        </span>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pt-8 mb-5">
              {widgets.map((widget, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href={widget.href}
                    onClick={() => handleWidgetClick(index)}
                    className={`${widget.bg} ${widget.hover} rounded-lg p-3 flex flex-col items-center gap-2 transition-all border border-gray-200 dark:border-gray-700 shadow-xs hover:shadow-sm relative`}
                  >
                    {aiSuggestion?.relevantWidget === index && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <div className={`p-2.5 rounded-md ${widget.color} ${widget.bg.replace('50', '100').replace('900/30', '800/40')}`}>
                      <widget.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                      {widget.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* AI Suggestion Panel at the bottom */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-3 rounded-lg border ${
                aiSuggestion?.relevantWidget !== undefined 
                  ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700'
              } flex items-start gap-3`}
            >
              <div className={`p-2 rounded-full ${
                aiSuggestion?.relevantWidget !== undefined 
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {isLoadingSuggestion ? (
                  <div className="flex gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"></span>
                  </div>
                ) : aiSuggestion ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Saran Pintar
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isLoadingSuggestion ? (
                    "Menganalisis aktivitas Anda..."
                  ) : aiSuggestion ? (
                    <>
                      {aiSuggestion.text}
                      {aiSuggestion.relevantWidget !== undefined && (
                        <span className="block mt-1 text-[0.7rem] text-blue-600 dark:text-blue-400">
                          Terkait dengan: {widgets[aiSuggestion.relevantWidget].label}
                        </span>
                      )}
                    </>
                  ) : (
                    "Tidak dapat memuat saran saat ini."
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};