import React from "react";

// Definisikan tipe untuk data aktivitas
interface Aktivitas {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  status: string;
}

// Data dummy aktivitas
const aktivitasData: Aktivitas[] = [
  {
    id: "1",
    judul: "Menyelesaikan Kursus React",
    deskripsi: "Anda telah menyelesaikan kursus React dengan nilai 95.",
    tanggal: "10 Oktober 2023",
    status: "Selesai",
  },
  {
    id: "2",
    judul: "Mengikuti Pelatihan Tailwind CSS",
    deskripsi: "Anda telah mengikuti pelatihan Tailwind CSS selama 2 hari.",
    tanggal: "15 Oktober 2023",
    status: "Selesai",
  },
  {
    id: "3",
    judul: "Mengikuti Workshop Next.js",
    deskripsi: "Anda telah mengikuti workshop Next.js selama 3 jam.",
    tanggal: "20 Oktober 2023",
    status: "Selesai",
  },
  {
    id: "4",
    judul: "Menghadiri Seminar Web Development",
    deskripsi: "Anda telah menghadiri seminar Web Development selama 1 hari.",
    tanggal: "25 Oktober 2023",
    status: "Selesai",
  },
  {
    id: "5",
    judul: "Mengerjakan Tugas Final Project",
    deskripsi: "Anda sedang mengerjakan tugas final project untuk kursus React.",
    tanggal: "30 Oktober 2023",
    status: "Dalam Proses",
  },
];

const RiwayatAktivitasPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Riwayat Aktivitas</h1>
        <div className="space-y-6">
          {aktivitasData.map((aktivitas) => (
            <div
              key={aktivitas.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{aktivitas.judul}</h2>
                  <p className="text-gray-600 mb-4">{aktivitas.deskripsi}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Tanggal:</strong> {aktivitas.tanggal}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    aktivitas.status === "Selesai"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {aktivitas.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiwayatAktivitasPage;