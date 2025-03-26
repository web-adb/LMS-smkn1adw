import React from 'react';
import { FileCheck, CalendarDays, User, BarChart2, Loader2 } from 'lucide-react';
import { Tugas } from './types';

interface GradingTabProps {
  loading: boolean;
  error: string | null;
  tugasPerluNilai: Tugas[];
}

export const GradingTab: React.FC<GradingTabProps> = ({ loading, error, tugasPerluNilai }) => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-amber-100 text-amber-600 mr-4 shadow-inner">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Tugas Perlu Dinilai</h2>
          <p className="text-gray-500 text-sm">Tugas yang sudah dikumpulkan dan perlu dinilai</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-xl">{error}</div>
      ) : tugasPerluNilai.length === 0 ? (
        <div className="text-center py-12">
          <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada tugas yang perlu dinilai</h3>
          <p className="mt-1 text-gray-500">Semua tugas sudah dinilai atau belum ada yang dikumpulkan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tugasPerluNilai.map((tugas) => (
            <div key={tugas.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-amber-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{tugas.judul}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tugas.deskripsi}</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Perlu Dinilai
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>
                    Deadline: {new Date(tugas.deadline).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>12 siswa mengumpulkan</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                  Lihat Pengumpulan
                </button>
                <button className="px-3 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Beri Nilai
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};