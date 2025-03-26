'use client';

import { useState, useEffect } from 'react';
import { Search, List, Grid } from 'lucide-react';
import { User, StatsData } from './types';
import StatsCards from './StatsCards';
import UserCard from './UserCard';
import { LoadingSkeleton } from './LoadingSkeleton';

const DaftarSiswa = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    activeStudents: 0,
    coursesTaken: 0,
    averageTime: '0h 0m'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        
        setStats({
          totalStudents: data.length,
          activeStudents: data.length,
          coursesTaken: data.length * 3,
          averageTime: '2h 30m'
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        <LoadingSkeleton />
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

      <StatsCards stats={stats} />

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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} viewMode={viewMode} />
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          Tidak ada siswa yang ditemukan.
        </div>
      )}
    </div>
  );
};

export default DaftarSiswa;