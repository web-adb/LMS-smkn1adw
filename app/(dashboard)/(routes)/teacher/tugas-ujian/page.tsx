'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from './Tabs';
import { SuccessPopup } from './SuccessPopup';
import { CreateAssignmentTab } from './CreateAssignmentTab';
import { AssignmentListTab } from './AssignmentListTab';
import { GradingTab } from './GradingTab';
import { Tugas, User, TabType } from './types';

const GuruTugasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('buat');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [tugasPerluNilai, setTugasPerluNilai] = useState<Tugas[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'daftar' || activeTab === 'nilai') {
          const res = await fetch('/api/tugas');
          if (!res.ok) throw new Error('Gagal mengambil data tugas');
          const data = await res.json();
          setTugas(data);
          
          if (activeTab === 'nilai') {
            setTugasPerluNilai(data.filter((t: Tugas) => t.dikumpulkan && !t.selesai));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleTandaiSelesai = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tugas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selesai: true }),
      });
      if (!res.ok) throw new Error('Gagal menandai tugas selesai');
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-800">Manajemen Tugas </h1> */}
            {/* <p className="text-gray-500">Kelola tugas dan penilaian peserta didik</p> */}
          </div>
          
          <Tabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            ungradedCount={tugasPerluNilai.length} 
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'buat' && <CreateAssignmentTab />}
          {activeTab === 'daftar' && (
            <AssignmentListTab
              loading={loading}
              error={error}
              tugas={tugas}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleTandaiSelesai={handleTandaiSelesai}
            />
          )}
          {activeTab === 'nilai' && (
            <GradingTab
              loading={loading}
              error={error}
              tugasPerluNilai={tugasPerluNilai}
            />
          )}
        </div>

        <SuccessPopup
          show={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          tabType={activeTab}
        />
      </div>
    </div>
  );
};

export default GuruTugasPage;