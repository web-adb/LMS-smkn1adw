import React from 'react';
import { BookOpen, ListChecks, FileCheck } from 'lucide-react';
import { TabType } from '../types';

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  ungradedCount: number;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, ungradedCount }) => {
  return (
    <div className="flex bg-white rounded-xl shadow-xs border border-gray-200 p-1">
      <button
        onClick={() => setActiveTab('buat')}
        className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'buat' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Buat Tugas
      </button>
      <button
        onClick={() => setActiveTab('daftar')}
        className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'daftar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        <ListChecks className="w-4 h-4 mr-2" />
        Daftar Tugas
      </button>
      <button
        onClick={() => setActiveTab('nilai')}
        className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'nilai' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        <FileCheck className="w-4 h-4 mr-2" />
        Perlu Dinilai
        {ungradedCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {ungradedCount}
          </span>
        )}
      </button>
    </div>
  );
};