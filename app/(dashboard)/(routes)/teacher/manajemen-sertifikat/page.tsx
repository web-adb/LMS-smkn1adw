'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Upload, User, FileText, Image, Loader2, ArrowRight, ArrowLeft, X } from 'lucide-react'; // Impor ikon dari Lucide

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
}

const UploadCertificatePage: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pasteArea, setPasteArea] = useState(''); // State untuk area paste
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State untuk pop-up berhasil

  // Mengambil daftar pengguna dari Clerk
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Gagal mengambil data pengguna');
        }
        const data = await response.json();
        setAvailableStudents(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          studentEmails: selectedStudents.map((student) => student.email),
          teacherId: userId,
        }),
      });

      if (response.ok) {
        setShowSuccessPopup(true); // Tampilkan pop-up berhasil
        setTimeout(() => {
          setShowSuccessPopup(false); // Sembunyikan pop-up setelah 3 detik
          router.push('/teacher/certificates');
        }, 3000);
      } else {
        alert('Terjadi kesalahan saat mengupload sertifikat.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengupload sertifikat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="w-6 h-6" /> Upload Sertifikat untuk Siswa
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Input Judul Sertifikat */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Judul Sertifikat
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Input Deskripsi */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Input URL Gambar Sertifikat */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <Image className="w-5 h-5" /> URL Gambar Sertifikat
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

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

          {/* Tombol Upload */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Upload Sertifikat
              </>
            )}
          </button>
        </form>
      </div>

      {/* Pop-up Berhasil */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Berhasil!</h2>
            <p className="text-gray-700">Sertifikat berhasil diupload.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificatePage;