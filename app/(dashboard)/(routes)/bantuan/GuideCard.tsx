import { motion } from "framer-motion";
import { GuideResource } from "./types";

interface GuideCardProps {
  guide: GuideResource;
  darkMode: boolean;
}

export const GuideCard = ({ guide, darkMode }: GuideCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${
        darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {guide.icon}
      </div>
      <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {guide.title}
      </h3>
    </div>
    <p className={`mb-4 flex-grow ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {guide.description}
    </p>
    <a
      href={guide.href}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium ${
        darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white'
      }`}
    >
      {guide.cta}
    </a>
  </motion.div>
);