import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil!</h2>
        <p className="text-gray-600 mb-6">Tugas berhasil dibuat dan dikirim ke siswa.</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;