import React from 'react';
import { User } from './types';
import { ArrowRight, ArrowLeft, X, User as UserIcon } from 'lucide-react';

interface StudentSelectionProps {
  availableStudents: User[];
  selectedStudents: User[];
  setAvailableStudents: React.Dispatch<React.SetStateAction<User[]>>;
  setSelectedStudents: React.Dispatch<React.SetStateAction<User[]>>;
  pasteArea: string;
  setPasteArea: React.Dispatch<React.SetStateAction<string>>;
}

const StudentSelection: React.FC<StudentSelectionProps> = ({
  availableStudents,
  selectedStudents,
  setAvailableStudents,
  setSelectedStudents,
  pasteArea,
  setPasteArea,
}) => {
  const moveSelected = (students: User[], target: User[], setTarget: React.Dispatch<React.SetStateAction<User[]>>) => {
    setAvailableStudents(availableStudents.filter((student) => !students.includes(student)));
    setTarget([...target, ...students]);
  };

  const removeSelected = (students: User[], target: User[], setTarget: React.Dispatch<React.SetStateAction<User[]>>) => {
    setSelectedStudents(selectedStudents.filter((student) => !students.includes(student)));
    setTarget([...target, ...students]);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = e.target.value;
    setPasteArea(pastedText);

    const emails = pastedText
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email !== '');

    const matchedStudents = availableStudents.filter((student) => student.email && emails.includes(student.email));

    setSelectedStudents([...selectedStudents, ...matchedStudents]);
    setAvailableStudents(availableStudents.filter((student) => !matchedStudents.includes(student)));
  };

  const handleUndo = (student: User) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    setAvailableStudents([...availableStudents, student]);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
          <UserIcon className="w-5 h-5" /> Pilih Siswa
        </label>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Daftar Murid Tersedia */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Daftar Murid</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <select multiple className="w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64">
                {availableStudents.map((student) => (
                  <option
                    key={student.id}
                    value={student.email || ''}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Pindah */}
          <div className="flex md:flex-col justify-center items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const selectElement = document.querySelector('select:first-of-type') as HTMLSelectElement;
                const selected = Array.from(selectElement.selectedOptions).map((option: HTMLOptionElement) => {
                  const email = option.value;
                  return availableStudents.find((student) => student.email === email)!;
                });
                moveSelected(selected, selectedStudents, setSelectedStudents);
              }}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              title="Tambahkan yang dipilih"
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
                removeSelected(selected, availableStudents, setAvailableStudents);
              }}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              title="Hapus yang dipilih"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Daftar Murid Dipilih */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Murid Dipilih</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <select multiple className="w-full p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-64">
                {selectedStudents.map((student) => (
                  <option
                    key={student.id}
                    value={student.email || ''}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {`${student.firstName || ''} ${student.lastName || ''} (${student.email})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Area Paste Daftar Murid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Atau Tempel Daftar Email Murid</h3>
        <textarea
          value={pasteArea}
          onChange={handlePaste}
          placeholder="Tempel daftar email murid di sini (satu per baris)"
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
        />
      </div>

      {/* Daftar Murid Dipilih */}
      {selectedStudents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Murid yang Dipilih</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
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
                    title="Hapus"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSelection;