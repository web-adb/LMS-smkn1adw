"use client";

import {
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  Clock,
  ChevronDown,
  FileText,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  User,
  Lock,
  BookOpen,
  Code,
  Video,
  Download,
  AlertCircle,
  MapPin,
  Globe,
  CalendarDays,
  Smartphone,
  Headphones,
  Mailbox,
  Zap,
  Shield,
  CreditCard,
  Settings,
  FileQuestion,
  FileSearch,
  Search,
  Sparkles,
  Bot
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ========== TYPES ==========
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "umum" | "teknis" | "pembayaran" | "akun";
  icon: React.ReactNode;
};

type ContactMethod = {
  id: string;
  name: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  action?: string;
  href?: string;
  available?: string;
};

type GuideResource = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
  href: string;
  type: "doc" | "video" | "troubleshoot" | "api";
};

type AISuggestion = {
  question: string;
  answer: string;
  relevantFAQ?: string;
};

// ========== COMPONENTS ==========
const FAQAccordionItem = ({
  item,
  isOpen,
  onClick,
  darkMode
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
  darkMode: boolean;
}) => (
  <div className={`border rounded-lg overflow-hidden transition-all ${
    isOpen 
      ? darkMode 
        ? 'border-indigo-500 bg-indigo-900/20' 
        : 'border-indigo-300 bg-indigo-50' 
      : darkMode 
        ? 'border-gray-700 hover:border-gray-600' 
        : 'border-gray-200 hover:border-gray-300'
  }`}>
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
      aria-expanded={isOpen}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {item.icon}
        </div>
        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {item.question}
        </h3>
      </div>
      <ChevronDown
        className={`w-5 h-5 transition-transform ${
          isOpen 
            ? darkMode 
              ? "rotate-180 text-indigo-400" 
              : "rotate-180 text-indigo-600" 
            : darkMode 
              ? "text-gray-400" 
              : "text-gray-500"
        }`}
      />
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={`px-4 pb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ml-9`}>
            {item.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ContactCard = ({ contact, darkMode }: { contact: ContactMethod; darkMode: boolean }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className={`rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex gap-4">
      <div className={`p-3 rounded-full flex-shrink-0 ${
        darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {contact.icon}
      </div>
      <div>
        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {contact.name}
        </h3>
        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {contact.value}
        </p>
        {contact.description && (
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {contact.description}
          </p>
        )}
        {contact.action && (
          <a
            href={contact.href}
            className={`inline-flex items-center mt-3 text-sm font-medium ${
              darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            {contact.action}
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        )}
        {contact.available && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            {contact.available}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

const GuideCard = ({ guide, darkMode }: { guide: GuideResource; darkMode: boolean }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${
        darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {guide.icon}
      </div>
      <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {guide.title}
      </h3>
    </div>
    <p className={`mb-4 flex-grow ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {guide.description}
    </p>
    <a
      href={guide.href}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium ${
        darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
      }`}
    >
      {guide.cta}
    </a>
  </motion.div>
);

const AIChatBubble = ({ suggestion, darkMode }: { suggestion: AISuggestion | null; darkMode: boolean }) => {
  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`mt-6 p-4 rounded-lg border ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-indigo-50/50 border-indigo-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
        }`}>
          <Bot className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-medium mb-1 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-700'
          }`}>
            Saran AI
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {suggestion.question}
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {suggestion.answer}
          </p>
          {suggestion.relevantFAQ && (
            <p className={`text-xs mt-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
              Lihat juga: {suggestion.relevantFAQ}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function BantuanDanDukunganPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "resources">("faq");
  const [activeCategory, setActiveCategory] = useState<"all" | FAQItem["category"]>("all");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check for dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  // FAQ Data
  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "Bagaimana cara mengubah kata sandi?",
      answer: "Untuk mengubah kata sandi: 1) Buka menu Profil > Pengaturan Akun 2) Pilih tab 'Keamanan' 3) Klik 'Ubah Kata Sandi' 4) Masukkan kata sandi lama dan baru 5) Simpan perubahan",
      category: "akun",
      icon: <Lock className="w-4 h-4" />
    },
    {
      id: "faq-2",
      question: "Bagaimana mengakses materi pembelajaran?",
      answer: "Materi dapat diakses melalui: 1) Dashboard utama > Menu 'Kursus Saya' 2) Pilih kursus yang diinginkan 3) Klik pada modul yang tersedia. Pastikan Anda telah terdaftar dalam kursus tersebut.",
      category: "umum",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: "faq-3",
      question: "Apa yang harus dilakukan jika lupa kata sandi?",
      answer: "Gunakan fitur 'Lupa Kata Sandi' di halaman login. Anda akan menerima email dengan tautan reset. Jika tidak menerima email, periksa folder spam atau hubungi dukungan kami.",
      category: "akun",
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      id: "faq-4",
      question: "Bagaimana melaporkan masalah teknis?",
      answer: "Anda dapat: 1) Gunakan form laporan di halaman ini 2) Email ke dukungan@lmsanda.com 3) Hubungi nomor darurat teknis +62 123 4567 891. Sertakan screenshot dan deskripsi detail masalah.",
      category: "teknis",
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: "faq-5",
      question: "Metode pembayaran apa yang tersedia?",
      answer: "Kami menerima: Transfer Bank (BCA, BRI, Mandiri), E-Wallet (OVO, Gopay, Dana), Kartu Kredit (Visa, Mastercard), dan Retail Payment (Alfamart, Indomaret).",
      category: "pembayaran",
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      id: "faq-6",
      question: "Bagaimana cara mengunduh sertifikat?",
      answer: "Setelah menyelesaikan kursus: 1) Buka halaman 'Sertifikat Saya' 2) Temukan sertifikat yang ingin diunduh 3) Klik tombol 'Unduh' 4) File PDF akan tersedia. Jika masalah tetap ada, hubungi dukungan.",
      category: "umum",
      icon: <Download className="w-4 h-4" />
    }
  ];

  // Contact Data
  const contactMethods: ContactMethod[] = [
    {
      id: "contact-1",
      name: "Email Dukungan",
      value: "dukungan@lmsanda.com",
      description: "Respon dalam 1-2 jam kerja",
      icon: <Mail className="w-5 h-5" />,
      action: "Kirim Email",
      href: "mailto:dukungan@lmsanda.com",
      available: "Senin-Jumat, 08:00-17:00 WIB"
    },
    {
      id: "contact-2",
      name: "Telepon",
      value: "+62 123 4567 890",
      description: "Layanan pelanggan",
      icon: <Phone className="w-5 h-5" />,
      action: "Hubungi Sekarang",
      href: "tel:+621234567890",
      available: "Setiap hari, 08:00-20:00 WIB"
    },
    {
      id: "contact-3",
      name: "Darurat Teknis",
      value: "+62 123 4567 891",
      description: "Untuk masalah kritis yang menghentikan pembelajaran",
      icon: <Zap className="w-5 h-5" />,
      action: "Hubungi Darurat",
      href: "tel:+621234567891",
      available: "24/7"
    },
    {
      id: "contact-4",
      name: "Chat Langsung",
      value: "Buka Chat Support",
      description: "Dukungan real-time melalui browser Anda",
      icon: <Headphones className="w-5 h-5" />,
      action: "Mulai Chat",
      href: "#live-chat",
      available: "Senin-Jumat, 09:00-18:00 WIB"
    },
    {
      id: "contact-5",
      name: "Kantor Pusat",
      value: "Jl. Pendidikan No. 123, Jakarta",
      description: "Kunjungan hanya dengan janji temu",
      icon: <MapPin className="w-5 h-5" />,
      action: "Lihat Peta",
      href: "https://maps.google.com",
      available: "Senin-Jumat, 09:00-17:00 WIB"
    },
    {
      id: "contact-6",
      name: "Media Sosial",
      value: "@LMSAnda_Official",
      description: "Instagram, Facebook, Twitter",
      icon: <Globe className="w-5 h-5" />,
      action: "Kunjungi Kami",
      href: "#social-media",
      available: "Respon dalam 24 jam"
    }
  ];

  // Guides Data
  const guides: GuideResource[] = [
    {
      id: "guide-1",
      title: "Panduan Pengguna Lengkap",
      description: "Dokumentasi komprehensif dengan petunjuk langkah demi langkah untuk semua fitur platform.",
      icon: <FileText className="w-5 h-5" />,
      cta: "Unduh PDF",
      href: "/panduan-pengguna",
      type: "doc"
    },
    {
      id: "guide-2",
      title: "Video Tutorial",
      description: "Koleksi video panduan visual untuk memulai dan memaksimalkan penggunaan LMS.",
      icon: <PlayCircle className="w-5 h-5" />,
      cta: "Tonton Sekarang",
      href: "/video-tutorial",
      type: "video"
    },
    {
      id: "guide-3",
      title: "Pemecahan Masalah",
      description: "Solusi untuk masalah umum yang sering dihadapi pengguna.",
      icon: <Search className="w-5 h-5" />,
      cta: "Pelajari Solusi",
      href: "/troubleshoot",
      type: "troubleshoot"
    },
    {
      id: "guide-4",
      title: "Dokumentasi API",
      description: "Panduan untuk pengembang yang ingin mengintegrasikan dengan sistem kami.",
      icon: <Code className="w-5 h-5" />,
      cta: "Lihat Dokumentasi",
      href: "/api-docs",
      type: "api"
    },
    {
      id: "guide-5",
      title: "Panduan Mobile App",
      description: "Cara menggunakan aplikasi mobile LMS kami di perangkat Android dan iOS.",
      icon: <Smartphone className="w-5 h-5" />,
      cta: "Buka Panduan",
      href: "/mobile-guide",
      type: "doc"
    },
    {
      id: "guide-6",
      title: "Kursus Pengenalan",
      description: "Ikuti kursus gratis untuk mempelajari dasar-dasar platform kami.",
      icon: <BookOpen className="w-5 h-5" />,
      cta: "Mulai Belajar",
      href: "/intro-course",
      type: "video"
    }
  ];

  // Filter FAQs by category and search query
  const filteredFAQs = (activeCategory === "all" ? faqData : faqData.filter(faq => faq.category === activeCategory))
    .filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Fetch AI suggestion
  const fetchAiSuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      // In a real app, you would use the Gemini API here
      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSuggestions = [
        {
          question: "Saya kesulitan mengakses materi kursus",
          answer: "Pastikan Anda sudah terdaftar dalam kursus tersebut. Jika sudah terdaftar tetapi masih tidak bisa mengakses, coba clear cache browser atau gunakan mode penyamaran.",
          relevantFAQ: "Bagaimana mengakses materi pembelajaran?"
        },
        {
          question: "Apakah ada batas waktu untuk menyelesaikan kursus?",
          answer: "Kebanyakan kursus memiliki waktu akses selama 1 tahun setelah pendaftaran. Namun beberapa kursus khusus mungkin memiliki durasi berbeda yang akan terlihat di halaman detail kursus.",
          relevantFAQ: ""
        },
        {
          question: "Bagaimana cara memastikan sertifikat saya valid?",
          answer: "Semua sertifikat dari platform kami memiliki kode verifikasi unik yang dapat dicek di halaman verifikasi sertifikat di website kami.",
          relevantFAQ: "Bagaimana cara mengunduh sertifikat?"
        }
      ];
      
      const randomSuggestion = mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
      setAiSuggestion(randomSuggestion);
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
      setAiSuggestion({
        question: "Maaf, terjadi kesalahan saat memproses permintaan Anda.",
        answer: "Silakan coba lagi nanti atau hubungi tim dukungan kami untuk bantuan lebih lanjut."
      });
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  // Fetch suggestion when tab changes to FAQ or when search query changes
  useEffect(() => {
    if (activeTab === "faq") {
      fetchAiSuggestion();
    }
  }, [activeTab, searchQuery]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
          <button
            onClick={() => setActiveTab("faq")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === "faq" 
                ? darkMode 
                  ? "border-indigo-400 text-indigo-400" 
                  : "border-indigo-600 text-indigo-600" 
                : darkMode 
                  ? "border-transparent text-gray-400 hover:text-gray-300" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === "contact" 
                ? darkMode 
                  ? "border-indigo-400 text-indigo-400" 
                  : "border-indigo-600 text-indigo-600" 
                : darkMode 
                  ? "border-transparent text-gray-400 hover:text-gray-300" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Kontak Kami
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              activeTab === "resources" 
                ? darkMode 
                  ? "border-indigo-400 text-indigo-400" 
                  : "border-indigo-600 text-indigo-600" 
                : darkMode 
                  ? "border-transparent text-gray-400 hover:text-gray-300" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sumber Daya
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Pertanyaan yang Sering Diajukan
              </h2>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === "all" 
                      ? darkMode 
                        ? "bg-indigo-600 text-white" 
                        : "bg-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua Kategori
                </button>
                <button
                  onClick={() => setActiveCategory("umum")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === "umum" 
                      ? darkMode 
                        ? "bg-indigo-600 text-white" 
                        : "bg-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <HelpCircle className="inline mr-1 w-4 h-4" />
                  Umum
                </button>
                <button
                  onClick={() => setActiveCategory("akun")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === "akun" 
                      ? darkMode 
                        ? "bg-indigo-600 text-white" 
                        : "bg-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <User className="inline mr-1 w-4 h-4" />
                  Akun
                </button>
                <button
                  onClick={() => setActiveCategory("teknis")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === "teknis" 
                      ? darkMode 
                        ? "bg-indigo-600 text-white" 
                        : "bg-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Settings className="inline mr-1 w-4 h-4" />
                  Teknis
                </button>
                <button
                  onClick={() => setActiveCategory("pembayaran")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === "pembayaran" 
                      ? darkMode 
                        ? "bg-indigo-600 text-white" 
                        : "bg-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CreditCard className="inline mr-1 w-4 h-4" />
                  Pembayaran
                </button>
              </div>

              {/* Search Box */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Cari pertanyaan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <FAQAccordionItem
                      key={faq.id}
                      item={faq}
                      isOpen={openAccordion === faq.id}
                      onClick={() => toggleAccordion(faq.id)}
                      darkMode={darkMode}
                    />
                  ))
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>Tidak ada FAQ yang ditemukan untuk pencarian ini.</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestion */}
            <AIChatBubble suggestion={aiSuggestion} darkMode={darkMode} />

            {/* Still Need Help */}
            <div className={`mt-6 border rounded-lg p-6 shadow-sm ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <HelpCircle className={`mx-auto h-10 w-10 mb-4 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`} />
                <h3 className={`text-lg font-medium mb-2 ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Masih butuh bantuan?
                </h3>
                <p className={`mb-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Jika Anda tidak menemukan jawaban yang Anda cari, tim dukungan kami siap membantu.
                </p>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium ${
                    darkMode 
                      ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Hubungi Dukungan
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Hubungi Tim Dukungan Kami
              </h2>
              <p className={`mb-8 max-w-3xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pilih metode kontak yang paling nyaman untuk Anda. Tim kami siap membantu dari Senin hingga Jumat, pukul 08:00 - 17:00 WIB.
              </p>

              {/* Contact Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contactMethods.map((contact) => (
                  <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    darkMode={darkMode} 
                  />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={`border rounded-lg p-6 shadow-sm ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-medium mb-4 ${
                darkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Kirim Pesan Langsung
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subjek
                  </label>
                  <select
                    id="subject"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option>Pilih subjek...</option>
                    <option>Masalah Teknis</option>
                    <option>Pertanyaan Akun</option>
                    <option>Pembayaran</option>
                    <option>Kursus</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Pesan Anda
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Deskripsikan pertanyaan atau masalah Anda secara detail..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium ${
                      darkMode 
                        ? 'bg-indigo-700 text-white hover:bg-indigo-600' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Sumber Daya Pembelajaran
              </h2>
              <p className={`mb-8 max-w-3xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Jelajahi panduan dan sumber daya kami untuk memaksimalkan penggunaan platform LMS.
              </p>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <GuideCard 
                    key={guide.id} 
                    guide={guide} 
                    darkMode={darkMode} 
                  />
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className={`border rounded-lg p-6 shadow-sm ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-medium mb-4 ${
                darkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Sumber Daya Tambahan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border-l-4 pl-4 py-1 ${
                  darkMode ? 'border-indigo-500' : 'border-indigo-500'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    Webinar & Pelatihan
                  </h4>
                  <p className={`mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Ikuti webinar bulanan kami untuk tips dan trik menggunakan platform.
                  </p>
                  <a href="#" className={`text-sm font-medium ${
                    darkMode 
                      ? 'text-indigo-400 hover:text-indigo-300' 
                      : 'text-indigo-600 hover:text-indigo-800'
                  }`}>
                    Lihat Jadwal <ArrowRight className="inline ml-1 w-4 h-4" />
                  </a>
                </div>
                <div className={`border-l-4 pl-4 py-1 ${
                  darkMode ? 'border-indigo-500' : 'border-indigo-500'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    Komunitas Pengguna
                  </h4>
                  <p className={`mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Bergabunglah dengan komunitas pengguna untuk berbagi pengalaman.
                  </p>
                  <a href="#" className={`text-sm font-medium ${
                    darkMode 
                      ? 'text-indigo-400 hover:text-indigo-300' 
                      : 'text-indigo-600 hover:text-indigo-800'
                  }`}>
                    Gabung Sekarang <ArrowRight className="inline ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}