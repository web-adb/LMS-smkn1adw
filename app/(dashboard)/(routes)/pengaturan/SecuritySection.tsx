import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Shield, ChevronUp, ChevronDown, CheckCircle } from "lucide-react";

interface SecuritySectionProps {
  expanded: boolean;
  toggleSection: (section: string) => void;
}

export default function SecuritySection({
  expanded,
  toggleSection,
}: SecuritySectionProps) {
  const { user } = useUser();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={() => toggleSection("security")}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Keamanan
          </h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-2 space-y-5 animate-fade-in">
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Cara Mengubah Kata Sandi:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">1</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Buka email yang terdaftar di akun Anda ({user?.primaryEmailAddress?.emailAddress})
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">2</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cari email dari Clerk dengan subjek "Permintaan Perubahan Kata Sandi"
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">3</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Klik tombol "Ubah Kata Sandi" dalam email tersebut
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">4</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ikuti instruksi pada halaman yang terbuka untuk membuat kata sandi baru
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Jika Anda tidak menerima email, periksa folder spam atau 
                <a 
                  href="mailto:support@example.com" 
                  className="ml-1 underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  hubungi support
                </a>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tips Keamanan Kata Sandi:
            </h3>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Gunakan minimal 12 karakter</li>
              <li>• Kombinasikan huruf besar, kecil, angka, dan simbol</li>
              <li>• Hindari menggunakan informasi pribadi</li>
              <li>• Jangan gunakan kata sandi yang sama untuk banyak akun</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}