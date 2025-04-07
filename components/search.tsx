// components/spotlight-search.tsx
"use client";

import { Search, X, Clock, BookOpen, Users, Layout, Compass, List, Pencil, Calendar, Trophy, Award, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = {
  icon: any;
  label: string;
  href: string;
};

type AISearchResult = {
  answer: string;
  relevantMenuItems: string[];
};

export const SpotlightSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResults, setAiResults] = useState<AISearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      icon: Layout,
      label: "Beranda",
      href: "/",
    },
    {
      icon: Compass,
      label: "Jelajahi Kursus",
      href: "/search",
    },
    {
      icon: List,
      label: "Tugas Saya",
      href: "/tugas",
    },
    {
      icon: Pencil,
      label: "Quiz",
      href: "/quiz",
    },
    {
      icon: Calendar,
      label: "Kalender",
      href: "/kalender",
    },
    {
      icon: Trophy,
      label: "Peringkat Siswa",
      href: "/papan-peringkat",
    },
    {
      icon: Award,
      label: "Sertifikat Saya",
      href: "/sertifikat",
    },
    {
      icon: Clock,
      label: "Aktivitas",
      href: "/riwayat-aktivitas",
    },
    {
      icon: MessageSquare,
      label: "Forum Diskusi",
      href: "/forum",
    },
    {
      icon: HelpCircle,
      label: "Pusat Bantuan",
      href: "/bantuan",
    },
    {
      icon: Settings,
      label: "Pengaturan Akun",
      href: "/pengaturan",
    },
  ];

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setAiResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetchAIResults(query);
        setAiResults(response);
      } catch (error) {
        console.error("Error fetching AI results:", error);
        setAiResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchAIResults = async (query: string): Promise<AISearchResult> => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }

    const prompt = `
      Anda adalah asisten pencarian untuk aplikasi e-learning. 
      Berikut adalah daftar menu yang tersedia:
      ${menuItems.map(item => `- ${item.label}: ${item.href}`).join('\n')}

      Pertanyaan pengguna: "${query}"

      Berikan:
      1. Jawaban singkat yang membantu (maksimal 2 kalimat)
      2. Daftar menu yang relevan dengan pertanyaan (jika ada)

      Format respons dalam JSON:
      {
        "answer": "string",
        "relevantMenuItems": "string[]"
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error("No text response from API");
    }

    const cleanedResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedResponse);
  };

  const handleSelectItem = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = menuItems.find(item => item.label === iconName)?.icon;
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Search className="w-4 h-4" />;
  };

  const getRelevantItems = (itemNames: string[]) => {
    return menuItems.filter(item => itemNames.includes(item.label));
  };

  return (
    <>
      {/* Search Trigger Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 rounded-full p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="h-4 w-4" />
      </motion.button>

      {/* Spotlight Modal */}
      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Glass Blur Background */}
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Search Container */}
            <motion.div 
              className="relative w-full max-w-xl bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 backdrop-blur-lg"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
            >
              {/* Search Input */}
              <div className="relative border-b border-white/20 dark:border-gray-700/50">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari menu atau tanyakan sesuatu..."
                  className="w-full py-5 pl-12 pr-16 bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <motion.button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query ? (
                  isLoading ? (
                    <motion.div 
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Mencari...
                    </motion.div>
                  ) : aiResults ? (
                    <motion.div 
                      className="divide-y divide-white/10 dark:divide-gray-700/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      {/* AI Answer */}
                      <motion.div 
                        className="p-4"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                          {aiResults.answer}
                        </p>
                        
                        {/* Relevant Menu Items */}
                        {aiResults.relevantMenuItems && aiResults.relevantMenuItems.length > 0 && (
                          <>
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                              Menu yang mungkin Anda cari:
                            </h4>
                            <div className="space-y-2">
                              {getRelevantItems(aiResults.relevantMenuItems).map((item, index) => (
                                <motion.button
                                  key={item.href}
                                  className="w-full text-left p-3 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 rounded-lg"
                                  onClick={() => handleSelectItem(item.href)}
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <motion.div 
                                    className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {getIcon(item.label)}
                                  </motion.div>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {item.label}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>

                      {/* Regular Search Results */}
                      {filteredItems.length > 0 && (
                        <>
                          <motion.div 
                            className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            Hasil pencarian menu:
                          </motion.div>
                          {filteredItems.map((item, index) => (
                            <motion.button
                              key={item.href}
                              className="w-full text-left p-4 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4"
                              onClick={() => handleSelectItem(item.href)}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 5 }}
                            >
                              <motion.div 
                                className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg"
                                whileHover={{ scale: 1.1 }}
                              >
                                {getIcon(item.label)}
                              </motion.div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.href}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </>
                      )}
                    </motion.div>
                  ) : filteredItems.length > 0 ? (
                    <motion.div 
                      className="divide-y divide-white/10 dark:divide-gray-700/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      {filteredItems.map((item, index) => (
                        <motion.button
                          key={item.href}
                          className="w-full text-left p-4 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4"
                          onClick={() => handleSelectItem(item.href)}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {getIcon(item.label)}
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.href}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="p-8 text-center text-gray-500 dark:text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Tidak ditemukan hasil untuk "{query}"
                    </motion.div>
                  )
                ) : (
                  <motion.div 
                    className="p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h3 className="text-sm font-medium px-3 py-2 text-gray-500 dark:text-gray-400">
                      Menu Aplikasi
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {menuItems.map((item, index) => (
                        <motion.button
                          key={item.href}
                          className="p-3 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3"
                          onClick={() => handleSelectItem(item.href)}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div 
                            className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg"
                            whileHover={{ rotate: 10 }}
                          >
                            {getIcon(item.label)}
                          </motion.div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <motion.div 
                className="p-3 border-t border-white/10 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between bg-white/10 dark:bg-gray-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span>Tekan Esc untuk tutup</span>
                <span className="flex items-center gap-1">
                  <kbd className="bg-white/20 dark:bg-gray-700/50 px-1.5 py-0.5 rounded">
                    ↑↓
                  </kbd>
                  <span>untuk navigasi</span>
                  <kbd className="bg-white/20 dark:bg-gray-700/50 px-1.5 py-0.5 rounded ml-2">
                    ↵
                  </kbd>
                  <span>untuk buka</span>
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};