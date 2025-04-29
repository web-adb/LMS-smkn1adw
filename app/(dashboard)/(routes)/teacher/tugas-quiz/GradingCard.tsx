import Link from "next/link";
import { FileCheck, Clock, ArrowRight } from "lucide-react";

export const GradingCard = () => {
  return (
    <Link
      href="/teacher/tugas-quiz/penilaian"
      className="group transition-all duration-300 hover:-translate-y-1"
      aria-label="Navigasi ke tugas perlu dinilai"
    >
      <div className="h-full bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-amber-200 overflow-hidden relative dark:bg-gray-800">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-50 rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>

        <div className="flex items-start mb-5 relative z-10">
          <div className="p-4 rounded-xl bg-amber-100 text-amber-600 mr-4 shadow-inner">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1 dark:text-white">
              Perlu Dinilai
            </h2>
            <p className="text-gray-500 text-sm dark:text-white">Tugas menunggu penilaian</p>
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <FileCheck className="w-4 h-4 text-amber-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-white">12 Total</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-white">5 Deadline Hari Ini</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-white">
            Berikan penilaian dan feedback untuk tugas yang sudah dikumpulkan
            peserta didik.
          </p>
        </div>

        <div className="flex justify-between items-center relative z-10">
          <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full">
            Prioritas Tinggi
          </span>
          <div className="flex items-center text-amber-600 group-hover:text-amber-800 transition-colors">
            <span className="font-medium mr-2">Beri Nilai</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};