'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Upload, User, FileText, Image, Loader2, ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
}

const UploadCertificatePage: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'students'>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pasteArea, setPasteArea] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setAvailableStudents(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, []);

  const moveSelected = (students: User[]) => {
    setAvailableStudents(availableStudents.filter((student) => !students.includes(student)));
    setSelectedStudents([...selectedStudents, ...students]);
  };

  const removeSelected = (students: User[]) => {
    setSelectedStudents(selectedStudents.filter((student) => !students.includes(student)));
    setAvailableStudents([...availableStudents, ...students]);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = e.target.value;
    setPasteArea(pastedText);

    const emails = pastedText
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email !== '');

    const matchedStudents = availableStudents.filter((student) =>
      student.email && emails.includes(student.email)
    );

    setSelectedStudents([...selectedStudents, ...matchedStudents]);
    setAvailableStudents(availableStudents.filter((student) => !matchedStudents.includes(student)));
  };

  const handleUndo = (student: User) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    setAvailableStudents([...availableStudents, student]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      alert('Please fill all required fields');
      return;
    }

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
          studentEmails: selectedStudents.map((student) => student.email).filter(Boolean),
          teacherId: userId,
        }),
      });

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push('/teacher/certificates');
        }, 2000);
      } else {
        throw new Error('Failed to upload certificate');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Upload Certificate</h1>
            <p className="text-gray-500">Create and distribute certificates to students</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('details')}
          >
            <FileText className="w-4 h-4" /> Certificate Details
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('students')}
          >
            <User className="w-4 h-4" /> Assign Students
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Certificate Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Certificate Title*</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Certificate of Completion"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Description*</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Describe what this certificate represents"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Certificate Image URL*</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste your certificate image URL"
                    required
                  />
                  {imageUrl && (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                      <img src={imageUrl} alt="Certificate preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Note: Upload your image to a service like Imgur first</p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Next: Assign Students <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Assign Students Tab */}
          {activeTab === 'students' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Students */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Available Students</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <select
                      multiple
                      className="w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64"
                    >
                      {availableStudents.map((student) => (
                        <option key={student.id} value={student.email || ''}>
                          {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transfer Buttons */}
                <div className="flex md:flex-col justify-center items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const selectElement = document.querySelector('select:first-of-type') as HTMLSelectElement;
                      const selected = Array.from(selectElement.selectedOptions).map((option: HTMLOptionElement) => {
                        const email = option.value;
                        return availableStudents.find((student) => student.email === email)!;
                      });
                      moveSelected(selected);
                    }}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Add selected"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const selectElement = document.querySelector('select:last-of-type') as HTMLSelectElement;
                      const selected = Array.from(selectElement.selectedOptions).map((option: HTMLOptionElement) => {
                        const email = option.value;
                        return selectedStudents.find((student) => student.email === email)!;
                      });
                      removeSelected(selected);
                    }}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Remove selected"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Selected Students */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Selected Students</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <select
                      multiple
                      className="w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64"
                    >
                      {selectedStudents.map((student) => (
                        <option key={student.id} value={student.email || ''}>
                          {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Paste Emails */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Or Paste Email List</h3>
                <textarea
                  value={pasteArea}
                  onChange={handlePaste}
                  placeholder="Paste student emails here (one per line)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                />
              </div>

              {/* Selected Students Preview */}
              {selectedStudents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''} Selected
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-xs">
                          <span className="text-gray-700 truncate">
                            {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUndo(student)}
                            className="p-1 text-red-500 hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Details
                </button>
                <button
                  type="submit"
                  disabled={isLoading || selectedStudents.length === 0}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Issue Certificates
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">Certificates have been issued successfully.</p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                router.push('/teacher/certificates');
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificatePage;