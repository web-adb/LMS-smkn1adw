// app/not-found.tsx
import Link from "next/link";
import { Metadata } from "next";
import { AlertTriangle, Home, Search, BookOpen, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan",
  description: "Halaman yang Anda cari tidak dapat ditemukan",
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-6">
        {/* Kartu Utama */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          
          {/* Header dengan Latar Biru */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 shadow-sm">
              <AlertTriangle 
                className="w-10 h-10 text-white" 
                strokeWidth={2} 
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">404</h1>
            <p className="text-blue-100 font-medium">Halaman Tidak Ditemukan</p>
          </div>

          {/* Konten Utama */}
          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Maaf, halaman yang Anda cari tidak dapat kami temukan.
              </p>
              
              {/* Panel Saran */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 text-left border border-slate-100 dark:border-slate-600">
                <h3 className="font-medium text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
                  Saran Pencarian
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-300 mt-1.5 mr-2"></span>
                    Periksa kembali URL yang Anda masukkan
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-300 mt-1.5 mr-2"></span>
                    Kembali ke beranda dan cari dari sana
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-300 mt-1.5 mr-2"></span>
                    Gunakan fitur pencarian kami
                  </li>
                </ul>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                <Home className="w-5 h-5" />
                Ke Beranda
              </Link>
              <Link
                href="/courses"
                className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-3 px-4 rounded-lg transition-all hover:shadow-sm"
              >
                <BookOpen className="w-5 h-5" />
                Lihat Kursus
              </Link>
            </div>
          </div>

          {/* Footer Bantuan */}
          <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 text-center border-t border-slate-100 dark:border-slate-600">
            <Link 
              href="/support" 
              className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-500 transition-colors"
            >
              <LifeBuoy className="w-4 h-4 mr-2" />
              Butuh bantuan? Hubungi tim support kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}