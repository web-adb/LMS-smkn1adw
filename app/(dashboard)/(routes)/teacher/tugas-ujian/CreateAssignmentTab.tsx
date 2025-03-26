import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const CreateAssignmentTab: React.FC = () => {
  return (
    <Link href="/teacher/tugas-ujian/create" className="block">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Buat Tugas Baru
            </h2>
            <p className="text-gray-500 text-sm">
              Buat tugas baru untuk peserta didik
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
