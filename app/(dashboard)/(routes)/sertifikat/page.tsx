import React from "react";

// Definisikan tipe untuk data sertifikat
interface Sertifikat {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string;
  tanggal: string;
}

// Data dummy sertifikat
const sertifikatData: Sertifikat[] = [
  {
    id: "1",
    judul: "Sertifikat Kelulusan Kursus React",
    deskripsi: "Sertifikat ini diberikan sebagai tanda kelulusan kursus React.",
    gambar: "/sertifikat-react.jpg",
    tanggal: "10 Oktober 2023",
  },
  {
    id: "2",
    judul: "Sertifikat Pelatihan Tailwind CSS",
    deskripsi: "Sertifikat ini diberikan setelah menyelesaikan pelatihan Tailwind CSS.",
    gambar: "/sertifikat-tailwind.jpg",
    tanggal: "15 Oktober 2023",
  },
  {
    id: "3",
    judul: "Sertifikat Workshop Next.js",
    deskripsi: "Sertifikat ini diberikan setelah mengikuti workshop Next.js.",
    gambar: "/sertifikat-nextjs.jpg",
    tanggal: "20 Oktober 2023",
  },
  {
    id: "4",
    judul: "Sertifikat Seminar Web Development",
    deskripsi: "Sertifikat ini diberikan setelah menghadiri seminar Web Development.",
    gambar: "/sertifikat-webdev.jpg",
    tanggal: "25 Oktober 2023",
  },
];

const HasilSertifikatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sertifikatData.map((sertifikat) => (
            <div
              key={sertifikat.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={sertifikat.gambar}
                alt={sertifikat.judul}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{sertifikat.judul}</h2>
                <p className="text-gray-600 mb-4">{sertifikat.deskripsi}</p>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Tanggal:</strong> {sertifikat.tanggal}
                </p>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  Unduh Sertifikat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HasilSertifikatPage;