'use client';
import React, { useEffect, useState } from 'react';
import { ClipboardList, CalendarDays, Clock, FileText, CheckCircle, MoreVertical, Upload } from 'lucide-react';
import { formatDate, formatTime } from '@/app/utils/dateUtils';
import { FileUpload } from './FileUpload';
import toast from 'react-hot-toast';

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  lampiran: string;
  selesai: boolean;
  dikumpulkan: boolean;
  filePengumpulan?: string;
}

const DaftarTugasPage: React.FC = () => {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [selectedTugas, setSelectedTugas] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchTugas = async () => {
      try {
        const response = await fetch('/api/tugas');
        const data = await response.json();
        setTugas(data);
      } catch (error) {
        console.error('Gagal mengambil data tugas:', error);
      }
    };

    fetchTugas();
  }, []);

  const handleTandaiSelesai = async (id: string, selesai: boolean) => {
    try {
      const response = await fetch(`/api/tugas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, selesai: !selesai }),
      });

      if (response.ok) {
        setTugas(tugas.map(t => t.id === id ? { ...t, selesai: !selesai } : t));
      }
    } catch (error) {
      console.error('Gagal mengupdate status tugas:', error);
    }
  };

  const handleFileUpload = (id: string, url?: string) => {
    setIsUploading(false);
    if (url) {
      handleKumpulkanTugas(id, url);
    }
  };

  const handleKumpulkanTugas = async (id: string, fileUrl?: string) => {
    try {
      const response = await fetch(`/api/tugas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          dikumpulkan: true,
          filePengumpulan: fileUrl 
        }),
      });

      if (response.ok) {
        setTugas(tugas.map(t => 
          t.id === id ? { ...t, dikumpulkan: true, filePengumpulan: fileUrl } : t
        ));
        toast.success('Tugas berhasil dikumpulkan!');
      }
    } catch (error) {
      console.error('Gagal mengumpulkan tugas:', error);
      toast.error('Gagal mengumpulkan tugas');
    }
  };

  const getDeadlineBadgeColor = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'bg-red-100 text-red-800';
    if (daysDiff <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Daftar Tugas</h1>
        <p className="text-sm text-gray-500">Lihat dan kelola tugas Anda di sini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tugas.map((tugas) => (
          <div key={tugas.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{tugas.judul}</h2>
              <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>

            <p className="text-sm text-gray-600 mb-4">{tugas.deskripsi}</p>

            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center text-sm px-3 py-1 rounded-full ${getDeadlineBadgeColor(tugas.deadline)}`}>
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{formatDate(tugas.deadline)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatTime(tugas.deadline)}</span>
              </div>
            </div>

            {tugas.lampiran && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FileText className="h-4 w-4 mr-2" />
                <a href={tugas.lampiran} target="_blank" rel="noopener" className="text-blue-500 hover:underline">
                  Lihat Lampiran
                </a>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {tugas.selesai ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2"></div>
                )}
                <span className="text-sm text-gray-600">
                  {tugas.selesai ? 'Selesai' : 'Belum Selesai'}
                </span>
              </div>
              <button
                onClick={() => handleTandaiSelesai(tugas.id, tugas.selesai)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {tugas.selesai ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
              </button>
            </div>

            {!tugas.dikumpulkan ? (
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTugas(selectedTugas === tugas.id ? null : tugas.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Kumpulkan Tugas</span>
                </button>

                {selectedTugas === tugas.id && (
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <FileUpload
                      endpoint="courseAttachment"
                      onChange={(url) => handleFileUpload(tugas.id, url)}
                      onUploadStart={() => setIsUploading(true)}
                    />
                    {isUploading && (
                      <p className="text-sm text-gray-500 mt-2">Mengunggah file...</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span>Terkumpul</span>
                </div>
                {tugas.filePengumpulan && (
                  <div className="text-sm text-gray-600 mt-2">
                    File: <a href={tugas.filePengumpulan} target="_blank" rel="noopener" className="text-blue-500 hover:underline">Lihat Pengumpulan</a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarTugasPage;