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
  Search
} from "lucide-react";
import { useState } from "react";
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

// ========== COMPONENTS ==========
const FAQAccordionItem = ({
  item,
  isOpen,
  onClick
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div className={`border rounded-lg overflow-hidden transition-all ${isOpen ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
      aria-expanded={isOpen}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{item.icon}</div>
        <h3 className="font-medium text-gray-800">{item.question}</h3>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180 text-indigo-600" : ""}`}
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
          <div className="px-4 pb-4 text-gray-600 ml-9">{item.answer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ContactCard = ({ contact }: { contact: ContactMethod }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex gap-4">
      <div className="p-3 bg-indigo-50 rounded-full flex-shrink-0">
        {contact.icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{contact.name}</h3>
        <p className="text-gray-600 mt-1">{contact.value}</p>
        {contact.description && (
          <p className="text-sm text-gray-500 mt-1">{contact.description}</p>
        )}
        {contact.action && (
          <a
            href={contact.href}
            className="inline-flex items-center mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {contact.action}
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        )}
        {contact.available && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {contact.available}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

const GuideCard = ({ guide }: { guide: GuideResource }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        {guide.icon}
      </div>
      <h3 className="font-medium text-gray-800">{guide.title}</h3>
    </div>
    <p className="text-gray-600 mb-4 flex-grow">{guide.description}</p>
    <a
      href={guide.href}
      className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
    >
      {guide.cta}
    </a>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function BantuanDanDukunganPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "resources">("faq");
  const [activeCategory, setActiveCategory] = useState<"all" | FAQItem["category"]>("all");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

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
      icon: <Lock className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "faq-2",
      question: "Bagaimana mengakses materi pembelajaran?",
      answer: "Materi dapat diakses melalui: 1) Dashboard utama > Menu 'Kursus Saya' 2) Pilih kursus yang diinginkan 3) Klik pada modul yang tersedia. Pastikan Anda telah terdaftar dalam kursus tersebut.",
      category: "umum",
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "faq-3",
      question: "Apa yang harus dilakukan jika lupa kata sandi?",
      answer: "Gunakan fitur 'Lupa Kata Sandi' di halaman login. Anda akan menerima email dengan tautan reset. Jika tidak menerima email, periksa folder spam atau hubungi dukungan kami.",
      category: "akun",
      icon: <HelpCircle className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "faq-4",
      question: "Bagaimana melaporkan masalah teknis?",
      answer: "Anda dapat: 1) Gunakan form laporan di halaman ini 2) Email ke dukungan@lmsanda.com 3) Hubungi nomor darurat teknis +62 123 4567 891. Sertakan screenshot dan deskripsi detail masalah.",
      category: "teknis",
      icon: <AlertCircle className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "faq-5",
      question: "Metode pembayaran apa yang tersedia?",
      answer: "Kami menerima: Transfer Bank (BCA, BRI, Mandiri), E-Wallet (OVO, Gopay, Dana), Kartu Kredit (Visa, Mastercard), dan Retail Payment (Alfamart, Indomaret).",
      category: "pembayaran",
      icon: <CreditCard className="w-4 h-4 text-indigo-600" />
    },
    {
      id: "faq-6",
      question: "Bagaimana cara mengunduh sertifikat?",
      answer: "Setelah menyelesaikan kursus: 1) Buka halaman 'Sertifikat Saya' 2) Temukan sertifikat yang ingin diunduh 3) Klik tombol 'Unduh' 4) File PDF akan tersedia. Jika masalah tetap ada, hubungi dukungan.",
      category: "umum",
      icon: <Download className="w-4 h-4 text-indigo-600" />
    }
  ];

  // Contact Data
  const contactMethods: ContactMethod[] = [
    {
      id: "contact-1",
      name: "Email Dukungan",
      value: "dukungan@lmsanda.com",
      description: "Respon dalam 1-2 jam kerja",
      icon: <Mail className="w-5 h-5 text-indigo-600" />,
      action: "Kirim Email",
      href: "mailto:dukungan@lmsanda.com",
      available: "Senin-Jumat, 08:00-17:00 WIB"
    },
    {
      id: "contact-2",
      name: "Telepon",
      value: "+62 123 4567 890",
      description: "Layanan pelanggan",
      icon: <Phone className="w-5 h-5 text-indigo-600" />,
      action: "Hubungi Sekarang",
      href: "tel:+621234567890",
      available: "Setiap hari, 08:00-20:00 WIB"
    },
    {
      id: "contact-3",
      name: "Darurat Teknis",
      value: "+62 123 4567 891",
      description: "Untuk masalah kritis yang menghentikan pembelajaran",
      icon: <Zap className="w-5 h-5 text-indigo-600" />,
      action: "Hubungi Darurat",
      href: "tel:+621234567891",
      available: "24/7"
    },
    {
      id: "contact-4",
      name: "Chat Langsung",
      value: "Buka Chat Support",
      description: "Dukungan real-time melalui browser Anda",
      icon: <Headphones className="w-5 h-5 text-indigo-600" />,
      action: "Mulai Chat",
      href: "#live-chat",
      available: "Senin-Jumat, 09:00-18:00 WIB"
    },
    {
      id: "contact-5",
      name: "Kantor Pusat",
      value: "Jl. Pendidikan No. 123, Jakarta",
      description: "Kunjungan hanya dengan janji temu",
      icon: <MapPin className="w-5 h-5 text-indigo-600" />,
      action: "Lihat Peta",
      href: "https://maps.google.com",
      available: "Senin-Jumat, 09:00-17:00 WIB"
    },
    {
      id: "contact-6",
      name: "Media Sosial",
      value: "@LMSAnda_Official",
      description: "Instagram, Facebook, Twitter",
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
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

  // Filter FAQs by category
  const filteredFAQs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("faq")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "faq" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "contact" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Kontak Kami
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === "resources" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pertanyaan yang Sering Diajukan</h2>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  Semua Kategori
                </button>
                <button
                  onClick={() => setActiveCategory("umum")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === "umum" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <HelpCircle className="inline mr-1 w-4 h-4" />
                  Umum
                </button>
                <button
                  onClick={() => setActiveCategory("akun")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === "akun" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <User className="inline mr-1 w-4 h-4" />
                  Akun
                </button>
                <button
                  onClick={() => setActiveCategory("teknis")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === "teknis" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <Settings className="inline mr-1 w-4 h-4" />
                  Teknis
                </button>
                <button
                  onClick={() => setActiveCategory("pembayaran")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === "pembayaran" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
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
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada FAQ yang ditemukan untuk kategori ini.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Still Need Help */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <HelpCircle className="mx-auto h-10 w-10 text-indigo-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Masih butuh bantuan?</h3>
                <p className="text-gray-600 mb-4">
                  Jika Anda tidak menemukan jawaban yang Anda cari, tim dukungan kami siap membantu.
                </p>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Hubungi Tim Dukungan Kami</h2>
              <p className="text-gray-600 mb-8 max-w-3xl">
                Pilih metode kontak yang paling nyaman untuk Anda. Tim kami siap membantu dari Senin hingga Jumat, pukul 08:00 - 17:00 WIB.
              </p>

              {/* Contact Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contactMethods.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Kirim Pesan Langsung</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subjek
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan Anda
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Deskripsikan pertanyaan atau masalah Anda secara detail..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sumber Daya Pembelajaran</h2>
              <p className="text-gray-600 mb-8 max-w-3xl">
                Jelajahi panduan dan sumber daya kami untuk memaksimalkan penggunaan platform LMS.
              </p>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Sumber Daya Tambahan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-800 mb-2">Webinar & Pelatihan</h4>
                  <p className="text-gray-600 mb-3">
                    Ikuti webinar bulanan kami untuk tips dan trik menggunakan platform.
                  </p>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Lihat Jadwal <ArrowRight className="inline ml-1 w-4 h-4" />
                  </a>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                  <h4 className="font-medium text-gray-800 mb-2">Komunitas Pengguna</h4>
                  <p className="text-gray-600 mb-3">
                    Bergabunglah dengan komunitas pengguna untuk berbagi pengalaman.
                  </p>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
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