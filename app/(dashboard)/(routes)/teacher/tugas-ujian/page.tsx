'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, CalendarDays, FileText, CheckCircle, Upload, Loader2, X, ArrowRight, ArrowLeft, User } from 'lucide-react';

interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  deadline: Date;
  lampiran?: string;
  selesai: boolean;
  dikumpulkan: boolean;
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
}

const GuruTugasPage: React.FC = () => {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [judul, setJudul] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [lampiran, setLampiran] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [pasteArea, setPasteArea] = useState<string>('');
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

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

  // Ambil daftar pengguna dari Clerk
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Gagal mengambil data pengguna');
      const data = await response.json();
      setAvailableStudents(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTugas();
    fetchUsers();
  }, []);

  // Handler untuk memindahkan murid ke daftar dipilih
  const moveSelected = (students: User[], target: User[], setTarget: React.Dispatch<React.SetStateAction<User[]>>) => {
    setAvailableStudents(availableStudents.filter((student) => !students.includes(student)));
    setTarget([...target, ...students]);
  };

  // Handler untuk menghapus murid dari daftar dipilih
  const removeSelected = (students: User[], target: User[], setTarget: React.Dispatch<React.SetStateAction<User[]>>) => {
    setSelectedStudents(selectedStudents.filter((student) => !students.includes(student)));
    setTarget([...target, ...students]);
  };

  // Handler untuk memproses daftar murid yang di-paste
  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = e.target.value;
    setPasteArea(pastedText);

    // Memisahkan teks yang di-paste menjadi array email
    const emails = pastedText
      .split('\n') // Pisahkan berdasarkan baris baru
      .map((email) => email.trim()) // Hilangkan spasi di awal dan akhir
      .filter((email) => email !== ''); // Hapus baris kosong

    // Cari murid yang sesuai dengan email yang di-paste
    const matchedStudents = availableStudents.filter((student) =>
      emails.includes(student.email)
    );

    // Tambahkan murid yang ditemukan ke daftar dipilih
    setSelectedStudents([...selectedStudents, ...matchedStudents]);
    setAvailableStudents(availableStudents.filter((student) => !matchedStudents.includes(student)));
  };

  // Handler untuk mengembalikan murid ke daftar tersedia (undo)
  const handleUndo = (student: User) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    setAvailableStudents([...availableStudents, student]);
  };

  // Buat tugas baru
  const handleBuatTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi || !deadline ) {
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
      setShowSuccessPopup(true); // Tampilkan pop-up berhasil
      setTimeout(() => setShowSuccessPopup(false), 3000); // Sembunyikan pop-up setelah 3 detik
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
          {step === 1 && (
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
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Selanjutnya
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Pilih Siswa */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" /> Pilih Siswa
                </label>
                <div className="flex gap-4">
                  {/* Daftar Murid Tersedia */}
                  <div className="w-1/2">
                    <h3 className="text-lg font-semibold mb-2">Daftar Murid</h3>
                    <select
                      multiple
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48"
                    >
                      {availableStudents.map((student) => (
                        <option key={student.id} value={student.email}>
                          {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tombol Pindah */}
                  <div className="flex flex-col justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const selected = Array.from(
                          document.querySelector('select:first-of-type')?.selectedOptions || []
                        ).map((option) => availableStudents.find((student) => student.email === option.value)!);
                        moveSelected(selected, selectedStudents, setSelectedStudents);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selected = Array.from(
                          document.querySelector('select:last-of-type')?.selectedOptions || []
                        ).map((option) => selectedStudents.find((student) => student.email === option.value)!);
                        removeSelected(selected, availableStudents, setAvailableStudents);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Daftar Murid Dipilih */}
                  <div className="w-1/2">
                    <h3 className="text-lg font-semibold mb-2">Murid Dipilih</h3>
                    <select
                      multiple
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48"
                    >
                      {selectedStudents.map((student) => (
                        <option key={student.id} value={student.email}>
                          {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Area Paste Daftar Murid */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Tempel Daftar Murid</h3>
                <textarea
                  value={pasteArea}
                  onChange={handlePaste}
                  placeholder="Tempel daftar email murid di sini (satu per baris)"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>

              {/* Area Kosong untuk Daftar Murid Dipilih */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Daftar Murid Dipilih</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {selectedStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between text-gray-700 mb-2">
                      <span>
                        {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUndo(student)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Konfirmasi Tugas</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Judul:</strong> {judul}</p>
                <p><strong>Deskripsi:</strong> {deskripsi}</p>
                <p><strong>Deadline:</strong> {new Date(deadline).toLocaleString()}</p>
                <p><strong>Lampiran:</strong> {lampiran || 'Tidak ada lampiran'}</p>
                <p><strong>Murid Dipilih:</strong></p>
                <ul>
                  {selectedStudents.map((student) => (
                    <li key={student.id}>
                      {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Buat Tugas'}
                </button>
              </div>
            </div>
          )}
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

      {/* Pop-up Berhasil */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Berhasil!</h2>
            <p className="text-gray-700">Tugas berhasil dibuat.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuruTugasPage;