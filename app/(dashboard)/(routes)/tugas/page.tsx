'use client'
import React from "react";
import { ClipboardList, CalendarDays, Clock, FileText, CheckCircle, MoreVertical, Upload } from "lucide-react"; // Import ikon dari Lucide

// Definisikan tipe untuk data tugas
interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  waktu: string;
  lampiran: string;
  selesai: boolean;
  dikumpulkan: boolean; // Tambahkan status pengumpulan tugas
}

// Data dummy tugas
const dummyTugas: Tugas[] = [
  {
    id: "tugas_1",
    judul: "Tugas Matematika - Aljabar",
    deskripsi: "Selesaikan soal aljabar halaman 45-50.",
    deadline: "2023-10-25",
    waktu: "23:59",
    lampiran: "soal_aljabar.pdf",
    selesai: false,
    dikumpulkan: false,
  },
  {
    id: "tugas_2",
    judul: "Tugas Bahasa Inggris - Essay",
    deskripsi: "Tulis essay tentang lingkungan sekitar.",
    deadline: "2023-10-27",
    waktu: "23:59",
    lampiran: "petunjuk_essay.docx",
    selesai: true,
    dikumpulkan: true,
  },
  {
    id: "tugas_3",
    judul: "Tugas Fisika - Gerak Lurus",
    deskripsi: "Kerjakan soal gerak lurus dari buku paket.",
    deadline: "2023-10-30",
    waktu: "23:59",
    lampiran: "soal_fisika.pdf",
    selesai: false,
    dikumpulkan: false,
  },
];

const DaftarTugasPage: React.FC = () => {
  // Fungsi untuk menangani pengumpulan tugas
  const handleKumpulkanTugas = (id: string) => {
    alert(`Tugas dengan ID ${id} berhasil dikumpulkan!`);
    // Di sini Anda bisa menambahkan logika untuk mengubah status tugas menjadi "dikumpulkan"
  };

  // Fungsi untuk menentukan warna badge berdasarkan deadline
  const getDeadlineBadgeColor = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return "bg-red-100 text-red-800"; // Deadline sudah lewat
    } else if (daysDiff <= 2) {
      return "bg-yellow-100 text-yellow-800"; // Deadline mendekati
    } else {
      return "bg-green-100 text-green-800"; // Deadline masih lama
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Daftar Tugas</h1>
        <p className="text-sm text-gray-500">Lihat dan kelola tugas Anda di sini.</p>
      </div>

      {/* Daftar Tugas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyTugas.map((tugas: Tugas) => (
          <div
            key={tugas.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            {/* Judul Tugas */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{tugas.judul}</h2>
              <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>

            {/* Deskripsi Tugas */}
            <p className="text-sm text-gray-600 mb-4">{tugas.deskripsi}</p>

            {/* Deadline dan Waktu */}
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center text-sm px-3 py-1 rounded-full ${getDeadlineBadgeColor(tugas.deadline)}`}>
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{tugas.deadline}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>{tugas.waktu}</span>
              </div>
            </div>

            {/* Lampiran */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FileText className="h-4 w-4 mr-2" />
              <span>{tugas.lampiran}</span>
            </div>

            {/* Status Tugas */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {tugas.selesai ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-2"></div>
                )}
                <span className="text-sm text-gray-600">
                  {tugas.selesai ? "Selesai" : "Belum Selesai"}
                </span>
              </div>
              <button className="text-sm text-blue-500 hover:text-blue-600">
                {tugas.selesai ? "Tandai Belum Selesai" : "Tandai Selesai"}
              </button>
            </div>

            {/* Tombol Kumpulkan Tugas */}
            {!tugas.dikumpulkan ? (
              <button
                onClick={() => handleKumpulkanTugas(tugas.id)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Kumpulkan Tugas</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Terkumpul</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarTugasPage;