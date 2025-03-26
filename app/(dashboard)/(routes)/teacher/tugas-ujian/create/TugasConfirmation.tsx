import React from 'react';
import { Tugas, User } from './types';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

interface TugasConfirmationProps {
  judul: string;
  deskripsi: string;
  deadline: string;
  lampiran: string;
  selectedStudents: User[];
  error: string | null;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

const TugasConfirmation: React.FC<TugasConfirmationProps> = ({
  judul,
  deskripsi,
  deadline,
  lampiran,
  selectedStudents,
  error,
  loading,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-6 text-center">Konfirmasi Tugas</h3>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Judul Tugas</h4>
            <p className="text-lg font-semibold text-gray-800">{judul}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Deskripsi</h4>
            <p className="text-gray-700 whitespace-pre-line">{deskripsi}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
              <p className="text-gray-700">
                {new Date(deadline).toLocaleString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Lampiran</h4>
              <p className="text-gray-700">
                {lampiran ? (
                  <a
                    href={lampiran}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lihat Lampiran
                  </a>
                ) : (
                  'Tidak ada lampiran'
                )}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Jumlah Murid</h4>
            <p className="text-gray-700">{selectedStudents.length} murid dipilih</p>
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 w-4 h-4" />
              Buat Tugas
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TugasConfirmation;