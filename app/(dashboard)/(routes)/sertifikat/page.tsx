'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  Download,
  Award,
  Clock,
  Calendar,
  FileText,
  Loader2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Skeleton } from './skeleton'; // Assuming you're using shadcn/ui

interface Certificate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  isVerified?: boolean;
  courseDuration?: string;
}

const HasilSertifikatPage: React.FC = () => {
  const { userId } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/certificates?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch certificates');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load certificates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCertificates();
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please sign in to view your certificates.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Certificates
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Certificates
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : certificates.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
              </p>
              {/* Future filter/sort functionality could go here */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative">
        <img
          src={certificate.imageUrl}
          alt={certificate.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/certificate-placeholder.png';
          }}
        />
        {certificate.isVerified && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {certificate.title}
          </h2>
          <div className="bg-blue-100 p-2 rounded-lg">
            <Award className="h-5 w-5 text-blue-500" />
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {certificate.description}
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              Issued: {new Date(certificate.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          {certificate.courseDuration && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{certificate.courseDuration}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Download
          </button>
          <button className="flex items-center justify-center p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors">
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No certificates yet
      </h3>
      <p className="text-gray-500 mb-6">
        Complete courses to earn certificates that will appear here.
      </p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Browse Courses
      </button>
    </div>
  );
};

export default HasilSertifikatPage;