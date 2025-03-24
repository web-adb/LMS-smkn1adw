'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Search, List, Grid } from 'lucide-react';

interface User {
  id: string; // Sesuaikan dengan respons API Anda
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string; // Properti untuk URL gambar profil
}

const DaftarSiswa = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // State untuk mode tampilan

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Set filteredUsers dengan data awal
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fungsi untuk memfilter pengguna berdasarkan query pencarian
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Daftar Siswa</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4 animate-pulse">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Siswa</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-md">
        <div className="pl-3 pr-2 text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari siswa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 outline-none"
        />
      </div>

      {/* Tampilan Grid atau List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              {/* Gambar Profil */}
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <UserIcon className="text-white" size={32} />
                  </div>
                )}
              </div>

              {/* Nama Siswa */}
              <h2
                className="text-lg font-semibold truncate w-full"
                title={`${user.firstName} ${user.lastName}`}
              >
                {user.firstName} {user.lastName}
              </h2>

              {/* Email dalam Badge Biru */}
              <div className="mt-2 w-full">
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4"
            >
              {/* Gambar Profil */}
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <UserIcon className="text-white" size={32} />
                  </div>
                )}
              </div>

              {/* Nama Siswa dan Email */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pesan jika tidak ada hasil pencarian */}
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          Tidak ada siswa yang ditemukan.
        </div>
      )}
    </div>
  );
};

export default DaftarSiswa;