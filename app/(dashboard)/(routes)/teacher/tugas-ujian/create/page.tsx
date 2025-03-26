'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, CalendarDays, FileText, CheckCircle, Upload, Loader2, X, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { Tugas, User } from './types';
import StepIndicator from './StepIndicator';
import StudentSelection from './StudentSelection';
import TugasForm from './TugasForm';
import TugasConfirmation from './TugasConfirmation';
import SuccessPopup from './SuccessPopup';

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

  const handleBuatTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi || !deadline) {
      setError('Judul, deskripsi, dan deadline wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul,
          deskripsi,
          deadline,
          lampiran,
          userId,
          studentIds: selectedStudents.map((student) => student.id),
        }),
      });
      if (!res.ok) throw new Error('Gagal membuat tugas');
      fetchTugas();
      setJudul('');
      setDeskripsi('');
      setDeadline('');
      setLampiran('');
      setUserId('');
      setSelectedStudents([]);
      setError(null);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        setStep(1);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleTandaiSelesai = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tugas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selesai: true }),
      });
      if (!res.ok) throw new Error('Gagal menandai tugas selesai');
      fetchTugas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Tugas</h1>
        </div>

        {/* Form Buat Tugas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-4 shadow-inner">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">Buat Tugas Baru</h2>
              <p className="text-gray-500 text-sm">Buat tugas baru untuk peserta didik</p>
            </div>
          </div>

          <StepIndicator currentStep={step} totalSteps={3} />

          <form onSubmit={handleBuatTugas}>
            {step === 1 && (
              <>
                <TugasForm
                  judul={judul}
                  setJudul={setJudul}
                  deskripsi={deskripsi}
                  setDeskripsi={setDeskripsi}
                  deadline={deadline}
                  setDeadline={setDeadline}
                  lampiran={lampiran}
                  setLampiran={setLampiran}
                  error={error}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Selanjutnya <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <StudentSelection
                  availableStudents={availableStudents}
                  selectedStudents={selectedStudents}
                  setAvailableStudents={setAvailableStudents}
                  setSelectedStudents={setSelectedStudents}
                  pasteArea={pasteArea}
                  setPasteArea={setPasteArea}
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Selanjutnya <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <TugasConfirmation
                judul={judul}
                deskripsi={deskripsi}
                deadline={deadline}
                lampiran={lampiran}
                selectedStudents={selectedStudents}
                error={error}
                loading={loading}
                onBack={() => setStep(2)}
                onSubmit={handleBuatTugas}
              />
            )}
          </form>
        </div>

        {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}
      </div>
    </div>
  );
};

export default GuruTugasPage;