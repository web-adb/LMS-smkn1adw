import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { AISuggestion } from "./types";

interface AIChatBubbleProps {
  suggestion: AISuggestion | null;
  darkMode: boolean;
}

export const AIChatBubble = ({ suggestion, darkMode }: AIChatBubbleProps) => {
  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`mt-6 p-4 rounded-lg border ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-indigo-50/50 border-indigo-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
        }`}>
          <Bot className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-medium mb-1 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-700'
          }`}>
            Saran AI
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {suggestion.question}
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {suggestion.answer}
          </p>
          {suggestion.relevantFAQ && (
            <p className={`text-xs mt-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-500'}`}>
              Lihat juga: {suggestion.relevantFAQ}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};