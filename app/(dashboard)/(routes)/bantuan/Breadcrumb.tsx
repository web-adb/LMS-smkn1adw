import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  return (
    <div className="mb-6 flex items-center text-sm text-gray-600 dark:text-gray-400">
      <Link href="/" className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400">
        <Home className="w-4 h-4 mr-2" />
        Beranda
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="text-indigo-600 dark:text-indigo-400">Pusat Bantuan</span>
    </div>
  );
}