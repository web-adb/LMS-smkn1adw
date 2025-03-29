'use client';
import React, { useEffect, useState } from 'react';
import { 
  ClipboardList, 
  CalendarDays, 
  Clock, 
  FileText, 
  CheckCircle, 
  MoreVertical, 
  Upload,
  Type,
  FileInput
} from 'lucide-react';
import { formatDate, formatTime } from '@/app/utils/dateUtils';
import { FileUpload } from './FileUpload';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  lampiran: string;
  pengumpulan?: {
    id: string;
    filePengumpulan: string;
    textPengumpulan: string;
    dikumpulkanPada: string;
    nilai: number | null;
    feedback: string | null;
  };
}

const DaftarTugasPage: React.FC = () => {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [selectedTugas, setSelectedTugas] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionType, setSubmissionType] = useState<'file' | 'text'>('file');
  const [textSubmission, setTextSubmission] = useState('');
  const { user } = useUser();

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

  const handleKumpulkanTugas = async (tugasId: string, content: string, isText: boolean = false) => {
    try {
      if (!user) {
        toast.error('Anda harus login untuk mengumpulkan tugas');
        return;
      }

      const submissionData = isText 
        ? { textPengumpulan: content }
        : { filePengumpulan: content };

      const response = await fetch('/api/tugas/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tugasId,
          ...submissionData,
          userId: user.id
        }),
      });

      if (response.ok) {
        const submission = await response.json();
        const updatedTugas = tugas.map(t => {
          if (t.id === tugasId) {
            return {
              ...t,
              pengumpulan: {
                id: submission.id,
                filePengumpulan: isText ? '' : content,
                textPengumpulan: isText ? content : '',
                dikumpulkanPada: new Date().toISOString(),
                nilai: null,
                feedback: null
              }
            };
          }
          return t;
        });
        setTugas(updatedTugas);
        toast.success('Tugas berhasil dikumpulkan!');
        setTextSubmission('');
      }
    } catch (error) {
      console.error('Gagal mengumpulkan tugas:', error);
      toast.error('Gagal mengumpulkan tugas');
    } finally {
      setIsUploading(false);
      setSelectedTugas(null);
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

            {!tugas.pengumpulan ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedTugas(selectedTugas === tugas.id ? null : tugas.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Kumpulkan Tugas</span>
                </button>

                {selectedTugas === tugas.id && (
                  <div className="p-3 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex border-b border-gray-200">
                      <button
                        className={`flex-1 py-2 font-medium text-sm ${submissionType === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setSubmissionType('file')}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <FileInput className="h-4 w-4" />
                          File
                        </div>
                      </button>
                      <button
                        className={`flex-1 py-2 font-medium text-sm ${submissionType === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setSubmissionType('text')}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Type className="h-4 w-4" />
                          Teks
                        </div>
                      </button>
                    </div>

                    {submissionType === 'file' ? (
                      <>
                        <FileUpload
                          endpoint="courseAttachment"
                          onChange={(url) => handleKumpulkanTugas(tugas.id, url)}
                          onUploadStart={() => setIsUploading(true)}
                        />
                        {isUploading && (
                          <p className="text-sm text-gray-500 mt-2">Mengunggah file...</p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                          placeholder="Tulis jawaban tugas Anda di sini..."
                          value={textSubmission}
                          onChange={(e) => setTextSubmission(e.target.value)}
                        />
                        <button
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                          onClick={() => handleKumpulkanTugas(tugas.id, textSubmission, true)}
                          disabled={!textSubmission.trim()}
                        >
                          Kumpulkan Teks
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span>Terkumpul pada {formatDate(tugas.pengumpulan.dikumpulkanPada)}</span>
                </div>
                
                {tugas.pengumpulan.filePengumpulan ? (
                  <div className="text-sm text-gray-600 mt-2">
                    File: <a href={tugas.pengumpulan.filePengumpulan} target="_blank" rel="noopener" className="text-blue-500 hover:underline">Lihat Pengumpulan</a>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 mt-2">
                    <p className="font-medium">Teks Jawaban:</p>
                    <div className="bg-gray-50 p-3 rounded-lg mt-1">
                      {tugas.pengumpulan.textPengumpulan}
                    </div>
                  </div>
                )}

                {tugas.pengumpulan.nilai !== null && (
                  <div className="text-sm text-gray-600 mt-2">
                    Nilai: <span className="font-medium">{tugas.pengumpulan.nilai}</span>
                  </div>
                )}
                {tugas.pengumpulan.feedback && (
                  <div className="text-sm text-gray-600 mt-2">
                    Feedback: <span className="italic">{tugas.pengumpulan.feedback}</span>
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