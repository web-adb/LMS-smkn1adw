// components/spotlight-search.tsx
"use client";

import { Search, X, Clock, BookOpen, Users, Layout, Compass, List, Pencil, Calendar, Trophy, Award, MessageSquare, HelpCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  // Daftar menu sesuai dengan yang Anda berikan
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

  // Filter menu items berdasarkan query
  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcut (Cmd/Ctrl + K)
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

  // Fetch AI results when query changes
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

    // Clean the response (sometimes Gemini adds markdown code blocks)
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
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 rounded-full p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Spotlight Modal */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setOpen(false)}
        >
          {/* Glass Blur Background */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Search Container */}
          <div 
            className="relative w-full max-w-xl bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
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
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query ? (
                isLoading ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Mencari...
                  </div>
                ) : aiResults ? (
                  <div className="divide-y divide-white/10 dark:divide-gray-700/50">
                    {/* AI Answer */}
                    <div className="p-4">
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
                            {getRelevantItems(aiResults.relevantMenuItems).map((item) => (
                              <button
                                key={item.href}
                                className="w-full text-left p-3 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3 rounded-lg"
                                onClick={() => handleSelectItem(item.href)}
                              >
                                <div className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg">
                                  {getIcon(item.label)}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Regular Search Results */}
                    {filteredItems.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Hasil pencarian menu:
                        </div>
                        {filteredItems.map((item) => (
                          <button
                            key={item.href}
                            className="w-full text-left p-4 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4"
                            onClick={() => handleSelectItem(item.href)}
                          >
                            <div className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg">
                              {getIcon(item.label)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.href}
                              </p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                ) : filteredItems.length > 0 ? (
                  <div className="divide-y divide-white/10 dark:divide-gray-700/50">
                    {filteredItems.map((item) => (
                      <button
                        key={item.href}
                        className="w-full text-left p-4 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4"
                        onClick={() => handleSelectItem(item.href)}
                      >
                        <div className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg">
                          {getIcon(item.label)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.href}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Tidak ditemukan hasil untuk "{query}"
                  </div>
                )
              ) : (
                <div className="p-4">
                  <h3 className="text-sm font-medium px-3 py-2 text-gray-500 dark:text-gray-400">
                    Menu Aplikasi
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.href}
                        className="p-3 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3"
                        onClick={() => handleSelectItem(item.href)}
                      >
                        <div className="bg-white/20 dark:bg-gray-700/50 p-2 rounded-lg">
                          {getIcon(item.label)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between bg-white/10 dark:bg-gray-800/50">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};