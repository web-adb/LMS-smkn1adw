import React from 'react';
import { Tugas } from '../types';

interface TugasFormProps {
  judul: string;
  setJudul: React.Dispatch<React.SetStateAction<string>>;
  deskripsi: string;
  setDeskripsi: React.Dispatch<React.SetStateAction<string>>;
  deadline: string;
  setDeadline: React.Dispatch<React.SetStateAction<string>>;
  lampiran: string;
  setLampiran: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
}

const TugasForm: React.FC<TugasFormProps> = ({
  judul,
  setJudul,
  deskripsi,
  setDeskripsi,
  deadline,
  setDeadline,
  lampiran,
  setLampiran,
  error,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 mb-2 font-medium">Judul Tugas</label>
        <input
          type="text"
          placeholder="Masukkan judul tugas"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2 font-medium">Deskripsi</label>
        <textarea
          placeholder="Masukkan deskripsi tugas"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">Lampiran (Opsional)</label>
          <input
            type="text"
            placeholder="Link lampiran"
            value={lampiran}
            onChange={(e) => setLampiran(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl">{error}</div>}
    </div>
  );
};

export default TugasForm;