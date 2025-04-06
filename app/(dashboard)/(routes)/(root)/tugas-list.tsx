'use client';
import { CalendarDays, Clock, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Pengumpulan {
  id: string;
  dikumpulkanPada: string;
  nilai: number | null;
}

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  lampiran: string;
  pengumpulan?: Pengumpulan;
}

export const TugasList = ({ 
  title = "Tugas Terbaru", 
  maxItems = 4 
}: {
  title?: string;
  maxItems?: number;
}) => {
  // Data dummy tugas
  const dummyTugas: Tugas[] = [
    {
      id: '1',
      judul: 'Tugas Matematika - Integral',
      deskripsi: 'Kerjakan soal integral pada halaman 45-50 buku paket. Upload jawaban dalam format PDF.',
      deadline: '2023-10-15T23:59:00',
      lampiran: 'soal_integral.pdf',
      pengumpulan: {
        id: 'sub1',
        dikumpulkanPada: '2023-10-14T14:30:00',
        nilai: 85
      }
    },
    {
      id: '2',
      judul: 'Makalah Sejarah Indonesia',
      deskripsi: 'Buat makalah tentang perjuangan kemerdekaan Indonesia minimal 5 halaman.',
      deadline: '2023-10-20T23:59:00',
      lampiran: 'pedoman_makalah.pdf',
      pengumpulan: {
        id: 'sub2',
        dikumpulkanPada: '2023-10-19T21:15:00',
        nilai: null
      }
    },
    {
      id: '3',
      judul: 'Praktikum Fisika - Hukum Ohm',
      deadline: '2023-10-12T23:59:00',
      deskripsi: 'Lakukan praktikum sesuai petunjuk di lab dan laporkan hasilnya.',
      lampiran: 'modul_praktikum.pdf'
    },
    {
      id: '4',
      judul: 'Resume Buku Sosiologi',
      deskripsi: 'Buat resume bab 3 buku Sosiologi Modern dengan ketentuan font Times New Roman 12pt.',
      deadline: '2023-10-25T23:59:00',
      lampiran: 'daftar_buku.pdf'
    },
    {
      id: '5',
      judul: 'Proyek Bahasa Inggris - Presentasi',
      deskripsi: 'Buat presentasi 10 slide tentang budaya Inggris. Presentasi akan dilakukan minggu depan.',
      deadline: '2023-10-18T23:59:00',
      lampiran: 'guidelines.pdf',
      pengumpulan: {
        id: 'sub5',
        dikumpulkanPada: '2023-10-17T10:45:00',
        nilai: 90
      }
    },
    {
      id: '6',
      judul: 'Tugas Kimia - Tabel Periodik',
      deskripsi: 'Analisis sifat-sifat unsur golongan IA dalam tabel periodik.',
      deadline: '2023-10-14T23:59:00',
      lampiran: 'tabel_periodik.xlsx'
    },
    {
      id: '7',
      judul: 'Esai Pendidikan Pancasila',
      deskripsi: 'Tulis esai tentang penerapan nilai-nilai Pancasila dalam kehidupan sehari-hari.',
      deadline: '2023-10-30T23:59:00',
      lampiran: 'rubrik_penilaian.docx',
      pengumpulan: {
        id: 'sub7',
        dikumpulkanPada: '2023-10-28T15:20:00',
        nilai: 88
      }
    },
    {
      id: '8',
      judul: 'Tugas Seni Budaya - Lukisan',
      deskripsi: 'Buat lukisan dengan tema alam bebas menggunakan media bebas.',
      deadline: '2023-11-05T23:59:00',
      lampiran: 'contoh_karya.jpg'
    },
    {
      id: '9',
      judul: 'Laporan Praktikum Biologi',
      deskripsi: 'Laporan hasil pengamatan mikroskopis sel tumbuhan dan hewan.',
      deadline: '2023-10-16T23:59:00',
      lampiran: 'protokol_praktikum.pdf'
    },
    {
      id: '10',
      judul: 'Tugas Geografi - Peta Dunia',
      deskripsi: 'Buat peta dunia dengan menandai semua benua dan samudera utama.',
      deadline: '2023-10-22T23:59:00',
      lampiran: 'template_peta.pdf',
      pengumpulan: {
        id: 'sub10',
        dikumpulkanPada: '2023-10-21T18:30:00',
        nilai: 95
      }
    }
  ];

  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchTugas = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulasi fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTugas(dummyTugas);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchTugas();
  }, []);

  // Hitung statistik tugas
  const statistik = {
    total: tugas.length,
    selesai: tugas.filter(t => t.pengumpulan).length,
    belumDikumpulkan: tugas.filter(t => !t.pengumpulan).length,
    deadlineMendekati: tugas.filter(t => {
      const deadline = new Date(t.deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 3 && diffDays >= 0 && !t.pengumpulan;
    }).length
  };

  const tugasToShow = tugas.slice(0, maxItems);

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 mb-6">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-medium">Gagal memuat tugas</h3>
        </div>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-red-800 dark:text-red-400 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 mb-8">
        <Skeleton className="h-8 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  if (tugasToShow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 text-center rounded-lg border border-dashed bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mb-8">
        <FileText className="w-10 h-10 text-muted-foreground dark:text-gray-400" />
        <h3 className="text-lg font-medium dark:text-white">Tidak ada tugas saat ini</h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Semua tugas yang diberikan akan muncul di sini
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header dengan dropdown */}
      <div 
        className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
          isExpanded 
            ? 'bg-white dark:bg-gray-900 border-blue-200 dark:border-gray-700' 
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between p-5 transition-colors ${
            isExpanded 
              ? 'hover:bg-blue-50 dark:hover:bg-gray-800' 
              : 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
            <span className="text-sm px-3 py-1 rounded-full bg-blue-600 dark:bg-blue-700 text-white font-medium">
              {tugas.length} Tugas
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
        </button>

        {isExpanded && (
          <div className="p-6 pt-0 space-y-6">
            {/* Statistik Tugas */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Tugas" 
                value={statistik.total} 
                icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                color="bg-blue-50 dark:bg-blue-900/20"
                borderColor="border-blue-200 dark:border-blue-800"
              />
              <StatCard 
                title="Terkumpul" 
                value={statistik.selesai} 
                icon={<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
                color="bg-green-50 dark:bg-green-900/20"
                borderColor="border-green-200 dark:border-green-800"
              />
              <StatCard 
                title="Belum Dikumpulkan" 
                value={statistik.belumDikumpulkan} 
                icon={<AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
                color="bg-yellow-50 dark:bg-yellow-900/20"
                borderColor="border-yellow-200 dark:border-yellow-800"
              />
              <StatCard 
                title="Deadline Dekat" 
                value={statistik.deadlineMendekati} 
                icon={<Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
                color="bg-orange-50 dark:bg-orange-900/20"
                borderColor="border-orange-200 dark:border-orange-800"
              />
            </div>

            {/* Daftar Tugas */}
            <div className="grid gap-6 md:grid-cols-2">
              {tugasToShow.map((tugas) => (
                <Link 
                  key={tugas.id} 
                  href={`/tugas/${tugas.id}`}
                  className="group block transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`p-6 border-2 rounded-xl transition-all group-hover:shadow-lg dark:group-hover:shadow-lg dark:group-hover:shadow-gray-800/50 ${
                    tugas.pengumpulan 
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                      : 'border-blue-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}>
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-lg line-clamp-2 text-gray-800 dark:text-white">{tugas.judul}</h3>
                      {tugas.pengumpulan ? (
                        <span className="flex-shrink-0 flex items-center text-sm bg-green-600 dark:bg-green-700 text-white px-3 py-1 rounded-full font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terkumpul
                        </span>
                      ) : (
                        <span className={`flex-shrink-0 text-sm px-3 py-1 rounded-full font-medium ${
                          getDeadlineStatus(tugas.deadline).class
                        }`}>
                          {getDeadlineStatus(tugas.deadline).text}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                      {tugas.deskripsi}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(tugas.deadline), {
                            addSuffix: true,
                            locale: id
                          })}
                        </span>
                      </div>

                      {tugas.lampiran && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Lampiran</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {tugas.length > maxItems && (
              <div className="pt-2 flex justify-end">
                <Link 
                  href="/tugas" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors"
                >
                  Lihat semua tugas
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Komponen StatCard yang diperbarui
const StatCard = ({ title, value, icon, color, borderColor }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}) => (
  <div className={`rounded-xl border-2 ${borderColor} ${color} p-5 shadow-sm dark:shadow-none`}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
      <div className="rounded-lg bg-white dark:bg-gray-700 p-2 shadow-sm">
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold mt-3 text-gray-800 dark:text-white">{value}</p>
  </div>
);

function getDeadlineStatus(deadline: string) {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) {
    return {
      text: 'Terlambat',
      class: 'bg-red-600 dark:bg-red-700 text-white'
    };
  }
  if (daysDiff === 0) {
    return {
      text: 'Deadline hari ini',
      class: 'bg-orange-600 dark:bg-orange-700 text-white'
    };
  }
  if (daysDiff <= 3) {
    return {
      text: `${daysDiff} hari lagi`,
      class: 'bg-yellow-600 dark:bg-yellow-700 text-white'
    };
  }
  return {
    text: 'Aktif',
    class: 'bg-blue-600 dark:bg-blue-700 text-white'
  };
}