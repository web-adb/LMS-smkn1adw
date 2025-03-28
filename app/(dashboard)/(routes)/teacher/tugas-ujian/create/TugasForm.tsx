"use client";

import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Tugas } from './types';
import toast from 'react-hot-toast';

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
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (url?: string) => {
    setIsUploading(false);
    if (url) {
      setLampiran(url);
      toast.success('File berhasil diunggah');
    }
  };

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
          <div className="space-y-2">
            <FileUpload
              endpoint="courseAttachment"
              onChange={handleFileUpload}
              onUploadStart={() => setIsUploading(true)}
            />
            
            {lampiran && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">File terunggah:</p>
                <a
                  href={lampiran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline break-all"
                >
                  {lampiran}
                </a>
                <button
                  type="button"
                  onClick={() => setLampiran('')}
                  className="mt-1 text-sm text-red-500 hover:text-red-700"
                >
                  Hapus file
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl">{error}</div>}
    </div>
  );
};

export default TugasForm;