"use client";

import { Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quiz } from "./types";

interface DeleteQuizModalProps {
  isOpen: boolean;
  quiz: Quiz | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteQuizModal({
  isOpen,
  quiz,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteQuizModalProps) {
  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">Hapus Quiz</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isDeleting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus quiz{" "}
              <span className="font-semibold">"{quiz.title}"</span>?
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Aksi ini tidak dapat dibatalkan. Semua data terkait quiz ini akan
              dihapus permanen.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menghapus...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash className="w-4 h-4" />
                  Hapus Quiz
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}