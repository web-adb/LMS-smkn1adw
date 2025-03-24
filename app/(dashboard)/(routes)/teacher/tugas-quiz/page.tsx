import Link from "next/link";
import {
  ClipboardList,
  AlertCircle,
  ArrowRight,
  FileCheck,
  Clock,
  BarChart2,
  Users,
  FileText,
} from "lucide-react";

export default function DashboardGuru() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Dashboard Pengajar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelola aktivitas mengajar dan pantau perkembangan peserta didik
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Peserta Didik</p>
                <p className="text-2xl font-bold text-gray-800">32</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-4">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tugas Aktif</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 mr-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Quiz Terkini</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 mr-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Perlu Dinilai</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Manajemen Tugas */}
          <Link
            href="/tugas"
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
                  <p className="text-gray-500 text-sm">
                    Kelola tugas pembelajaran
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 relative z-10">
                Buat, edit, dan berikan penilaian untuk tugas peserta didik.
                Pantau perkembangan dan berikan feedback.
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

          {/* Card Bank Soal & Quiz */}
          <Link
            href="/quiz"
            className="group transition-all duration-300 hover:-translate-y-1"
            aria-label="Navigasi ke bank soal dan quiz"
          >
            <div className="h-full bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-200 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-50 rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>

              <div className="flex items-start mb-5 relative z-10">
                <div className="p-4 rounded-xl bg-purple-100 text-purple-600 mr-4 shadow-inner">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Bank Soal & Quiz
                  </h2>
                  <p className="text-gray-500 text-sm">Evaluasi pembelajaran</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 relative z-10">
                Buat quiz dan ujian, kelola bank soal, serta analisis hasil
                evaluasi peserta didik.
              </p>

              <div className="flex justify-between items-center relative z-10">
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
                  12 perlu dinilai
                </span>
                <div className="flex items-center text-purple-600 group-hover:text-purple-800 transition-colors">
                  <span className="font-medium mr-2">Kelola Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
          <Link
            href="/penilaian"
            className="group transition-all duration-300 hover:-translate-y-1"
            aria-label="Navigasi ke tugas perlu dinilai"
          >
            <div className="h-full bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-amber-200 overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-50 rounded-full opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>

              <div className="flex items-start mb-5 relative z-10">
                <div className="p-4 rounded-xl bg-amber-100 text-amber-600 mr-4 shadow-inner">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Perlu Dinilai
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Tugas menunggu penilaian
                  </p>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <FileCheck className="w-4 h-4 text-amber-500 mr-1" />
                    <span className="text-sm text-gray-600">12 Total</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      5 Deadline Hari Ini
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">
                  Berikan penilaian dan feedback untuk tugas yang sudah
                  dikumpulkan peserta didik.
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
        </div>
      </div>
    </div>
  );
}
