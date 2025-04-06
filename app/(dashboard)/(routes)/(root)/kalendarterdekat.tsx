'use client';
import { CalendarDays, Clock, ChevronRight, AlertCircle, CheckCircle2, Bell, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Acara {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  waktu: string;
  jenis: 'ujian' | 'tugas' | 'acara' | 'lainnya';
  status: 'akan-datang' | 'berlangsung' | 'selesai';
  aiSuggestion?: string;
}

export const KalenderTerdekat = ({ 
  defaultExpanded = false,
  showAISuggestions = false
}: {
  defaultExpanded?: boolean;
  showAISuggestions?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);
  const [acara, setAcara] = useState<Acara[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  // Data dummy acara
  const dummyAcara: Acara[] = [
    {
      id: '1',
      judul: 'UTS Matematika',
      deskripsi: 'Ujian Tengah Semester Matematika Kelas X',
      tanggal: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Besok
      waktu: '08:00 - 10:00',
      jenis: 'ujian',
      status: 'akan-datang'
    },
    {
      id: '2',
      judul: 'Batas Pengumpulan Tugas Fisika',
      deskripsi: 'Tugas Hukum Newton',
      tanggal: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 hari lagi
      waktu: '23:59',
      jenis: 'tugas',
      status: 'akan-datang'
    },
    {
      id: '3',
      judul: 'Rapat Orang Tua',
      deskripsi: 'Pembahasan kegiatan semester depan',
      tanggal: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], // 4 hari lagi
      waktu: '13:00 - 15:00',
      jenis: 'acara',
      status: 'akan-datang'
    },
    {
      id: '4',
      judul: 'Praktikum Biologi',
      deskripsi: 'Pengamatan sel tumbuhan',
      tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Kemarin
      waktu: '10:00 - 12:00',
      jenis: 'lainnya',
      status: 'selesai'
    },
    {
      id: '5',
      judul: 'Libur Nasional',
      deskripsi: 'Hari Sumpah Pemuda',
      tanggal: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // 7 hari lagi
      waktu: '00:00 - 23:59',
      jenis: 'acara',
      status: 'akan-datang'
    }
  ];

  // Inisialisasi Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  // Fetch saran AI
  const fetchAISuggestion = async (acaraId: string, acaraData: Acara) => {
    if (!showAISuggestions || loadingAI[acaraId] || acara.find(a => a.id === acaraId)?.aiSuggestion) return;

    setLoadingAI(prev => ({ ...prev, [acaraId]: true }));

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Berikan saran singkat (maksimal 2 kalimat) dalam Bahasa Indonesia untuk mempersiapkan acara berikut:
Judul: ${acaraData.judul}
Deskripsi: ${acaraData.deskripsi}
Tanggal: ${formatTanggal(acaraData.tanggal)}
Waktu: ${acaraData.waktu}
Jenis: ${acaraData.jenis}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setAcara(prev => prev.map(item => 
        item.id === acaraId ? { ...item, aiSuggestion: text } : item
      ));
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAcara(prev => prev.map(item => 
        item.id === acaraId ? { ...item, aiSuggestion: "Gagal memuat saran AI" } : item
      ));
    } finally {
      setLoadingAI(prev => ({ ...prev, [acaraId]: false }));
    }
  };

  // Cek ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulasi loading data
      await new Promise(resolve => setTimeout(resolve, 800));
      setAcara(dummyAcara);
      setLoading(false);
    };

    loadData();
  }, []);

  // Urutkan berdasarkan tanggal terdekat
  const acaraTerurut = [...acara].sort((a, b) => 
    new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  );

  // Format tanggal untuk ditampilkan
  const formatTanggal = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hari ini';
    if (isTomorrow(date)) return 'Besok';
    return format(date, 'EEEE, d MMMM yyyy', { locale: id });
  };

  // Warna berdasarkan jenis acara
  const getJenisColor = (jenis: string) => {
    switch (jenis) {
      case 'ujian': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'tugas': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'acara': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    }
  };

  // Icon berdasarkan jenis acara
  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case 'ujian': return <AlertCircle className="h-5 w-5" />;
      case 'tugas': return <CheckCircle2 className="h-5 w-5" />;
      case 'acara': return <Bell className="h-5 w-5" />;
      default: return <CalendarDays className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse">
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700 ${
        isExpanded ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-5 border-b flex items-center justify-between transition-colors ${
          isExpanded 
            ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' 
            : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">Kalender Terdekat</h2>
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-sm px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
          >
            {acara.length} Acara
          </motion.span>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="divide-y dark:divide-gray-700">
              {acaraTerurut.map((acara) => {
                const tanggalParsed = parseISO(acara.tanggal);
                const isLewat = new Date(acara.tanggal) < new Date() && !isToday(tanggalParsed);

                return (
                  <motion.div
                    key={acara.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getJenisColor(acara.jenis)}`}>
                          {acara.jenis}
                        </span>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`mt-2 p-2 rounded-lg ${getJenisColor(acara.jenis)}`}
                        >
                          {getJenisIcon(acara.jenis)}
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">{acara.judul}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{acara.deskripsi}</p>
                        
                        {showAISuggestions && (
                          <div className="mt-2">
                            {loadingAI[acara.id] ? (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Membuat saran...
                              </div>
                            ) : acara.aiSuggestion ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs p-2 mt-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                              >
                                <div className="flex items-start gap-1">
                                  <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{acara.aiSuggestion}</span>
                                </div>
                              </motion.div>
                            ) : (
                              <button
                                onClick={() => fetchAISuggestion(acara.id, acara)}
                                className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <Sparkles className="h-3 w-3" />
                                Dapatkan saran persiapan
                              </button>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{formatTanggal(acara.tanggal)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{acara.waktu}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        {isLewat ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Selesai
                          </span>
                        ) : isToday(tanggalParsed) ? (
                          <motion.span 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            Hari Ini
                          </motion.span>
                        ) : null}
                        {!isMobile && (
                          <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};