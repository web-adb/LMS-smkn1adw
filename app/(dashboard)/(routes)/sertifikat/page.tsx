'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Certificate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const HasilSertifikatPage: React.FC = () => {
  const { userId } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil sertifikat dari API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`/api/certificates?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data sertifikat');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCertificates();
    }
  }, [userId]);

  if (!userId) {
    return <div>Anda harus login untuk melihat sertifikat.</div>;
  }

  if (isLoading) {
    return <div>Memuat sertifikat...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sertifikat Saya</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{certificate.title}</h2>
                  <p className="text-gray-600 mb-4">{certificate.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    <strong>Tanggal:</strong>{' '}
                    {new Date(certificate.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                    Unduh Sertifikat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Anda belum memiliki sertifikat.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HasilSertifikatPage;