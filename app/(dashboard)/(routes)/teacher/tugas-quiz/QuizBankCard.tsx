import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export const QuizBankCard = () => {
  return (
    <Link
      href="/teacher/tugas-quiz/quiz"
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
          Buat quiz dan ujian, kelola bank soal, serta analisis hasil evaluasi
          peserta didik.
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
  );
};