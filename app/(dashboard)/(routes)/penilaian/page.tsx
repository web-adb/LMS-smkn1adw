'use client';

import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown,
  Star,
  Download,
  MessageSquare,
  User,
  CalendarDays
} from 'lucide-react';
import { formatDate, formatTime } from '@/app/utils/dateUtils';

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: Date;
  lampiran: string | null;
}

interface Pengumpulan {
  id: string;
  tugasId: string;
  userId: string;
  user: {
    email: string;
  };
  filePengumpulan: string;
  dikumpulkanPada: Date;
  nilai: number | null;
  feedback: string | null;
  selesai: boolean;
  dikumpulkan: boolean;
}

const PenilaianTugasPage = () => {
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [selectedTugas, setSelectedTugas] = useState<string | null>(null);
  const [pengumpulanList, setPengumpulanList] = useState<Pengumpulan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all assignments
  useEffect(() => {
    const fetchTugas = async () => {
      try {
        const response = await fetch('/api/tugas');
        const data = await response.json();
        setTugasList(data);
        if (data.length > 0) setSelectedTugas(data[0].id);
      } catch (error) {
        console.error('Gagal mengambil data tugas:', error);
      }
    };

    fetchTugas();
  }, []);

  // Fetch submissions when assignment is selected
  useEffect(() => {
    if (!selectedTugas) return;

    const fetchPengumpulan = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tugas/submissions?tugasId=${selectedTugas}`);
        const data = await response.json();
        setPengumpulanList(data);
      } catch (error) {
        console.error('Gagal mengambil data pengumpulan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPengumpulan();
  }, [selectedTugas]);

  // Handle grading submission
  const handleNilai = async (pengumpulanId: string, nilai: number, feedback: string) => {
    try {
      const response = await fetch('/api/tugas/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pengumpulanId,
          nilai,
          feedback,
          selesai: true,
          dikumpulkan: true
        }),
      });

      if (response.ok) {
        const updatedList = pengumpulanList.map(item => 
          item.id === pengumpulanId 
            ? { ...item, nilai, feedback, selesai: true, dikumpulkan: true } 
            : item
        );
        setPengumpulanList(updatedList);
        setExpandedFeedback(null);
      }
    } catch (error) {
      console.error('Gagal menyimpan nilai:', error);
    }
  };

  // Filter submissions based on search and status filter
  const filteredPengumpulan = pengumpulanList.filter(p => {
    const matchesSearch = p.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'semua' || 
      (filterStatus === 'dinilai' && p.selesai) ||
      (filterStatus === 'terkumpul' && p.dikumpulkan && !p.selesai) ||
      (filterStatus === 'belum' && !p.dikumpulkan);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Penilaian Tugas</h1>
            <p className="text-gray-600">Review dan berikan nilai untuk tugas siswa</p>
          </div>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari siswa..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="semua">Semua Status</option>
                <option value="dinilai">Sudah Dinilai</option>
                <option value="terkumpul">Terkumpul</option>
                <option value="belum">Belum Mengumpulkan</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Assignment List Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4 h-fit">
            <h2 className="font-semibold text-lg mb-4 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Daftar Tugas
            </h2>
            <div className="space-y-2">
              {tugasList.map((tugas) => (
                <div
                  key={tugas.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTugas === tugas.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedTugas(tugas.id)}
                >
                  <h3 className="font-medium">{tugas.judul}</h3>
                  <p className="text-sm text-gray-500 truncate">{tugas.deskripsi}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    <span>Deadline: {formatDate(tugas.deadline.toString())}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission List */}
          <div className="lg:col-span-3 space-y-6">
            {selectedTugas && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-lg mb-2">
                    {tugasList.find(t => t.id === selectedTugas)?.judul}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {tugasList.find(t => t.id === selectedTugas)?.deskripsi}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>
                      {pengumpulanList.filter(p => p.dikumpulkan).length} dari {pengumpulanList.length} siswa telah mengumpulkan
                    </span>
                  </div>
                </div>

                {isLoading ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p>Memuat data pengumpulan...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium text-gray-700">
                      <div className="col-span-4">Siswa</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-2">Nilai</div>
                      <div className="col-span-3">Aksi</div>
                    </div>

                    {filteredPengumpulan.length > 0 ? (
                      filteredPengumpulan.map((pengumpulan) => (
                        <div key={pengumpulan.id} className="grid grid-cols-12 p-4 border-b hover:bg-gray-50">
                          <div className="col-span-4 flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{pengumpulan.user.email}</p>
                              {pengumpulan.dikumpulkanPada && (
                                <p className="text-xs text-gray-500">
                                  Dikumpulkan: {formatDate(pengumpulan.dikumpulkanPada.toString())} {formatTime(pengumpulan.dikumpulanPada.toString())}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="col-span-3 flex items-center">
                            {pengumpulan.selesai ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Sudah Dinilai
                              </span>
                            ) : pengumpulan.dikumpulkan ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Terkumpul
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="mr-1 h-3 w-3" />
                                Belum Mengumpulkan
                              </span>
                            )}
                          </div>

                          <div className="col-span-2 flex items-center">
                            {pengumpulan.nilai !== null ? (
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="font-medium">{pengumpulan.nilai}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>

                          <div className="col-span-3 flex items-center space-x-2">
                            {pengumpulan.filePengumpulan && (
                              <a
                                href={pengumpulan.filePengumpulan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                            
                            <button
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                              onClick={() => setExpandedFeedback(expandedFeedback === pengumpulan.id ? null : pengumpulan.id)}
                              title="Feedback"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </button>

                            {expandedFeedback === pengumpulan.id && (
                              <div className="absolute right-0 mt-8 mr-4 w-64 bg-white shadow-lg rounded-lg p-4 z-10 border border-gray-200">
                                <h4 className="font-medium mb-2">Berikan Nilai & Feedback</h4>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="Nilai (0-100)"
                                  className="w-full p-2 border border-gray-300 rounded mb-2"
                                  value={pengumpulan.nilai || ''}
                                  onChange={(e) => {
                                    const updatedList = pengumpulanList.map(item => 
                                      item.id === pengumpulan.id 
                                        ? { ...item, nilai: e.target.value ? Number(e.target.value) : null } 
                                        : item
                                    );
                                    setPengumpulanList(updatedList);
                                  }}
                                />
                                <textarea
                                  placeholder="Tulis feedback..."
                                  className="w-full p-2 border border-gray-300 rounded mb-2 h-24"
                                  value={pengumpulan.feedback || ''}
                                  onChange={(e) => {
                                    const updatedList = pengumpulanList.map(item => 
                                      item.id === pengumpulan.id 
                                        ? { ...item, feedback: e.target.value } 
                                        : item
                                    );
                                    setPengumpulanList(updatedList);
                                  }}
                                />
                                <button
                                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                  onClick={() => {
                                    if (pengumpulan.nilai !== null) {
                                      handleNilai(pengumpulan.id, pengumpulan.nilai, pengumpulan.feedback || '');
                                    }
                                  }}
                                >
                                  Simpan
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        Tidak ada pengumpulan yang sesuai dengan filter
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenilaianTugasPage;