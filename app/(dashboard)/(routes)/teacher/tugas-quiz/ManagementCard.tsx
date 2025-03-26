import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";

export const ManagementCard = () => {
  return (
    <Link
      href="/teacher/tugas-ujian"
      className="group transition-all duration-300 hover:-translate-y-1"
      aria-label="Navigasi ke manajemen tugas"
    >
      <div className="h-full bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>

        <div className="flex items-start mb-5 relative z-10">
          <div className="p-4 rounded-xl bg-blue-100 text-blue-600 mr-4 shadow-inner">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Manajemen Tugas
            </h2>
            <p className="text-gray-500 text-sm">Kelola tugas pembelajaran</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6 relative z-10">
          Buat, edit, dan berikan penilaian untuk tugas peserta didik. Pantau
          perkembangan dan berikan feedback.
        </p>

        <div className="flex justify-between items-center relative z-10">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            5 tugas aktif
          </span>
          <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
            <span className="font-medium mr-2">Kelola Tugas</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};