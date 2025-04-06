// app/not-found.tsx
'use client';

import Link from "next/link";
import { AlertTriangle, Home, Search, Database, LifeBuoy, Cloud, Server, Lock, RefreshCw, BookOpen, HelpCircle, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFound() {
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Update current time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAiSuggestion = async () => {
      setIsLoading(true);
      setError("");
      setUnauthorized(false);
      
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: "Berikan 1 saran singkat dalam 1 kalimat (bahasa Indonesia) untuk pengguna yang menemukan error 404 di LMS Komputasi Awan. Gunakan bahasa yang ramah dan membantu. Jawaban hanya berisi saran saja tanpa kalimat pengantar."
                }]
              }]
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setUnauthorized(true);
            throw new Error("Unauthorized access to AI service");
          }
          throw new Error("Failed to fetch AI suggestion");
        }

        const data = await response.json();
        const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || "Coba periksa kembali URL atau kembali ke dashboard utama.";
        setAiSuggestion(suggestion);
      } catch (err) {
        console.error("Error fetching AI suggestion:", err);
        if (!unauthorized) {
          setError("Gagal memuat saran AI. Silakan coba lagi nanti.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiSuggestion();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      opacity: [0.8, 0.4, 0.8],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const retryFetch = () => {
    setError("");
    setUnauthorized(false);
    useEffect(() => {}, []); // This will trigger the useEffect again
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 overflow-hidden p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 text-blue-300"
          variants={floatVariants}
          animate="float"
        >
          <Cloud className="w-full h-full" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-20 w-48 h-48 text-blue-200"
          variants={floatVariants}
          animate="float"
          initial={{ y: 20 }}
        >
          <Cloud className="w-full h-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-1/4 w-32 h-32 text-blue-400"
          variants={pulseVariants}
          animate="pulse"
        >
          <Server className="w-full h-full" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 w-28 h-28 text-sky-500"
          variants={pulseVariants}
          animate="pulse"
          initial={{ opacity: 0.6 }}
        >
          <Database className="w-full h-full" />
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row"
          variants={itemVariants}
          layout
        >
          {/* Left Panel - Visual Error Display */}
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col items-center justify-center text-center md:w-2/5"
            variants={itemVariants}
            layout
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-full mb-4 md:mb-6 shadow-lg"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {unauthorized ? (
                <Lock className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
              ) : (
                <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={1.5} />
              )}
            </motion.div>
            
            <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-1 md:mb-2" variants={itemVariants}>
              {unauthorized ? "401" : "404"}
            </motion.h1>
            
            <motion.p className="text-blue-100 font-medium text-base md:text-lg mb-4 md:mb-6" variants={itemVariants}>
              {unauthorized ? "Akses Tidak Diizinkan" : "Sumber Daya Tidak Ditemukan"}
            </motion.p>
            
            <motion.div 
              className="w-12 md:w-16 h-1 bg-white/30 rounded-full" 
              variants={itemVariants}
            />
          </motion.div>

          {/* Right Panel - Content */}
          <motion.div
            className="p-6 md:p-8 flex-1 flex flex-col justify-between"
            variants={containerVariants}
            layout
          >
            <div>
              <motion.h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-white mb-2" variants={itemVariants}>
                {unauthorized ? "Akses Ditolak" : "Halaman Tidak Ditemukan"}
              </motion.h2>
              
              <motion.p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mb-4 md:mb-6" variants={itemVariants}>
                {unauthorized 
                  ? "Anda tidak memiliki izin untuk mengakses sumber daya ini. Silakan login dengan akun yang sesuai atau hubungi administrator."
                  : "Sumber daya yang Anda cari tidak ditemukan di platform kami. Mungkin telah dipindahkan atau dihapus."}
              </motion.p>

              {/* AI Suggestion or Error Panel */}
              <AnimatePresence mode="wait">
                {unauthorized ? (
                  <motion.div
                    className="bg-red-50/70 dark:bg-red-900/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-red-100 dark:border-red-900/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-start">
                      <Lock className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 mt-0.5 text-red-500 dark:text-red-400" />
                      <div>
                        <h3 className="font-medium text-red-700 dark:text-red-300 text-sm md:text-base mb-1">
                          Masalah Autentikasi
                        </h3>
                        <p className="text-xs md:text-sm text-red-600 dark:text-red-400">
                          Sistem mendeteksi masalah hak akses. Pastikan Anda login dengan akun yang benar.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    className="bg-blue-50/50 dark:bg-slate-700 rounded-lg p-3 md:p-4 mb-4 md:mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-blue-300 border-t-blue-500 animate-spin"></div>
                      <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300">Memuat saran AI...</span>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    className="bg-yellow-50/70 dark:bg-yellow-900/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-yellow-100 dark:border-yellow-900/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 mt-0.5 text-yellow-500 dark:text-yellow-400" />
                      <div>
                        <h3 className="font-medium text-yellow-700 dark:text-yellow-300 text-sm md:text-base mb-1">
                          Gagal Memuat Saran
                        </h3>
                        <p className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400">
                          {error}
                        </p>
                        <button 
                          onClick={retryFetch}
                          className="mt-1 md:mt-2 inline-flex items-center text-xs text-yellow-700 dark:text-yellow-300 hover:underline"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" /> Coba lagi
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : aiSuggestion ? (
                  <motion.div
                    className="bg-blue-50/70 dark:bg-slate-700 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-blue-100 dark:border-slate-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-start">
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 mt-0.5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium text-blue-700 dark:text-blue-300 text-sm md:text-base mb-1">
                          Saran AI
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">{aiSuggestion}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Action Suggestions */}
              <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                <h3 className="font-medium text-slate-700 dark:text-slate-200 text-sm md:text-base mb-2 md:mb-3 flex items-center">
                  <Search className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500 dark:text-blue-400" />
                  {unauthorized ? "Solusi yang mungkin:" : "Coba langkah berikut:"}
                </h3>
                <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                  <motion.li className="flex items-start" variants={itemVariants}>
                    <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 mr-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                      1
                    </span>
                    {unauthorized 
                      ? "Pastikan Anda login dengan akun yang benar" 
                      : "Periksa kembali URL yang Anda masukkan"}
                  </motion.li>
                  <motion.li className="flex items-start" variants={itemVariants}>
                    <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 mr-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                      2
                    </span>
                    {unauthorized 
                      ? "Hubungi administrator untuk meminta akses" 
                      : "Kembali ke dashboard utama dan cari dari sana"}
                  </motion.li>
                  <motion.li className="flex items-start" variants={itemVariants}>
                    <span className="inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 mr-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                      3
                    </span>
                    {unauthorized 
                      ? "Coba login ulang atau periksa koneksi Anda" 
                      : "Gunakan fitur pencarian untuk menemukan konten"}
                  </motion.li>
                </ul>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-2 md:gap-3"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="flex-1">
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm md:text-base"
                >
                  <Home className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{unauthorized ? "Ke Halaman Login" : "Ke Dashboard"}</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="flex-1">
                <Link
                  href={unauthorized ? "/support" : "/courses"}
                  className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all hover:shadow-sm active:scale-95 text-sm md:text-base"
                >
                  {unauthorized ? (
                    <>
                      <LifeBuoy className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Dukungan Teknis</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Jelajahi Kursus</span>
                    </>
                  )}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Combined Footer Links - Responsive */}
        <motion.div
          className="mt-4 md:mt-6"
          variants={itemVariants}
        >
          {isMobile ? (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <Link href="/support" className="flex items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Butuh bantuan?
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <div className="flex items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Server className="w-4 h-4 mr-2" />
                  Status Sistem Cloud
                </div>
                <span className="font-medium text-green-600 dark:text-green-400 text-sm">{currentTime}</span>
              </div>
              <Link href="/docs" className="flex items-center justify-between p-3">
                <div className="flex items-center text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Dokumentasi
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 md:gap-4 text-xs md:text-sm">
                <Link
                  href="/support"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Butuh bantuan?
                </Link>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400 inline-flex items-center">
                    <Server className="w-4 h-4 mr-2" />
                    Status Sistem Cloud: <span className="ml-1 font-medium text-green-600 dark:text-green-400">{currentTime}</span>
                  </span>
                  <span className="text-slate-400">•</span>
                </div>
                <Link
                  href="/docs"
                  className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Dokumentasi
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}