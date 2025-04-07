import { CheckCircle, AlertCircle } from "lucide-react";

interface MessageBannerProps {
  successMessage: string;
  errorMessage: string;
}

export default function MessageBanner({ successMessage, errorMessage }: MessageBannerProps) {
  return (
    <>
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        </div>
      )}
    </>
  );
}