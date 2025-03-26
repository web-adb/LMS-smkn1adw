import React from 'react';
import { ListChecks, CalendarDays, FileText, Loader2 } from 'lucide-react';
import { Tugas } from '../../types';

interface AssignmentListTabProps {
  loading: boolean;
  error: string | null;
  tugas: Tugas[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTandaiSelesai: (id: string) => void;
}

export const AssignmentListTab: React.FC<AssignmentListTabProps> = ({
  loading,
  error,
  tugas,
  searchQuery,
  setSearchQuery,
  handleTandaiSelesai
}) => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-xl bg-purple-100 text-purple-600 mr-4 shadow-inner">
          <ListChecks className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Daftar Tugas</h2>
          <p className="text-gray-500 text-sm">Semua tugas yang telah dibuat</p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari tugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Filter Status</option>
            <option>Semua</option>
            <option>Aktif</option>
            <option>Selesai</option>
          </select>
          <select className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Urutkan</option>
            <option>Terbaru</option>
            <option>Deadline</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-xl">{error}</div>
      ) : (
        <div className="space-y-4">
          {tugas
            .filter(t => t.judul.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((tugas) => (
              <div key={tugas.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{tugas.judul}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tugas.deskripsi}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {tugas.selesai ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Selesai
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Aktif
                      </span>
                    )}
                    {tugas.nilai && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Dinilai: {tugas.nilai}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(tugas.deadline).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {tugas.lampiran && (
                    <a 
                      href={tugas.lampiran} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Lampiran
                    </a>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleTandaiSelesai(tugas.id)}
                    disabled={loading || tugas.selesai}
                    className={`px-3 py-1.5 rounded-lg text-sm ${tugas.selesai 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-green-600 text-white hover:bg-green-700'} transition-colors`}
                  >
                    {tugas.selesai ? 'Sudah Selesai' : 'Tandai Selesai'}
                  </button>
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};