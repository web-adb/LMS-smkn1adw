'use client'
import { useUser, UserButton } from "@clerk/nextjs";
import React from "react";

// Definisikan tipe untuk data siswa
interface Siswa {
  id: string;
  nama: string;
  profileImageUrl: string;
  progress: number;
}

// Data dummy pengguna (gantikan dengan data dari Clerk atau backend)
const dummyUsers: Siswa[] = [
  { id: "user_1", nama: "John Doe", profileImageUrl: "/default-avatar.png", progress: 85 },
  { id: "user_2", nama: "Jane Smith", profileImageUrl: "/default-avatar.png", progress: 70 },
  { id: "user_3", nama: "Alice Johnson", profileImageUrl: "/default-avatar.png", progress: 95 },
  { id: "user_4", nama: "Bob Brown", profileImageUrl: "/default-avatar.png", progress: 60 },
];

const PeringkatPage: React.FC = () => {
  // Ambil data pengguna yang sedang login
  const { user } = useUser();

  // Urutkan siswa berdasarkan progress (peringkat)
  const sortedSiswaData = dummyUsers.sort((a: Siswa, b: Siswa) => b.progress - a.progress);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Minimalis (Opsional) */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">Papan Peringkat</h1>
      </div>

      {/* Tabel Full Screen */}
      <div className="overflow-auto h-[calc(100vh-64px)]">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peringkat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSiswaData.map((siswa: Siswa, index: number) => (
              <tr
                key={siswa.id}
                className={`${
                  user?.id === siswa.id ? "bg-blue-50" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <img
                    src={siswa.profileImageUrl}
                    alt={siswa.nama}
                    className="h-10 w-10 rounded-full"
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{siswa.nama}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${siswa.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-700">
                      {siswa.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeringkatPage;