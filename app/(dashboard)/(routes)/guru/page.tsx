'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, CalendarDays, FileText, CheckCircle, Upload, Loader2 } from 'lucide-react';

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: Date;
  lampiran?: string;
  selesai: boolean;
  dikumpulkan: boolean;
}

const GuruTugasPage: React.FC = () => {
    const [tugas, setTugas] = useState<Tugas[]>([]);
    const [judul, setJudul] = useState<string>('');
    const [deskripsi, setDeskripsi] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [lampiran, setLampiran] = useState<string>('');
    const [userId, setUserId] = useState<string>(''); // Tambahkan state untuk userId
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Ambil data tugas dari API
    const fetchTugas = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tugas');
        if (!res.ok) throw new Error('Gagal mengambil data tugas');
        const data = await res.json();
        setTugas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchTugas();
    }, []);
  
    // Buat tugas baru
    const handleBuatTugas = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!judul || !deskripsi || !deadline || !userId) {
        setError('Judul, deskripsi, deadline, dan userId wajib diisi');
        return;
      }
  
      setLoading(true);
      try {
        const res = await fetch('/api/tugas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ judul, deskripsi, deadline, lampiran, userId }),
        });
        if (!res.ok) throw new Error('Gagal membuat tugas');
        fetchTugas(); // Refresh daftar tugas
        setJudul('');
        setDeskripsi('');
        setDeadline('');
        setLampiran('');
        setUserId('');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
  
    // Tandai tugas sebagai selesai
    const handleTandaiSelesai = async (id: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tugas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selesai: true }),
        });
        if (!res.ok) throw new Error('Gagal menandai tugas selesai');
        fetchTugas(); // Refresh daftar tugas
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Form Buat Tugas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Buat Tugas Baru</h2>
          <form onSubmit={handleBuatTugas}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Judul Tugas"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Deskripsi Tugas"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Link Lampiran (opsional)"
                value={lampiran}
                onChange={(e) => setLampiran(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Buat Tugas'}
              </button>
            </div>
          </form>
        </div>
  
        {/* Daftar Tugas */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tugas.map((tugas) => (
              <div key={tugas.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">{tugas.judul}</h3>
                <p className="text-sm text-gray-600 mb-4">{tugas.deskripsi}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(tugas.deadline).toLocaleString()}
                  </span>
                </div>
                {tugas.lampiran && (
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <a href={tugas.lampiran} className="text-sm text-blue-500 hover:underline">
                      Lampiran
                    </a>
                  </div>
                )}
                <button
                  onClick={() => handleTandaiSelesai(tugas.id)}
                  disabled={loading || tugas.selesai}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
                >
                  {tugas.selesai ? 'Sudah Selesai' : 'Tandai Selesai'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default GuruTugasPage;