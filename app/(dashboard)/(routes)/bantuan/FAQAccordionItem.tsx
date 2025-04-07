import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQItem } from "./types";

interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
  darkMode: boolean;
}

export const FAQAccordionItem = ({
  item,
  isOpen,
  onClick,
  darkMode
}: FAQAccordionItemProps) => (
  <div className={`border rounded-lg overflow-hidden transition-all ${
    isOpen 
      ? darkMode 
        ? 'border-indigo-500 bg-indigo-900/20' 
        : 'border-indigo-300 bg-indigo-50' 
      : darkMode 
        ? 'border-gray-700 hover:border-gray-600' 
        : 'border-gray-200 hover:border-gray-300'
  }`}>
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
      aria-expanded={isOpen}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {item.icon}
        </div>
        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {item.question}
        </h3>
      </div>
      <ChevronDown
        className={`w-5 h-5 transition-transform ${
          isOpen 
            ? darkMode 
              ? "rotate-180 text-indigo-400" 
              : "rotate-180 text-indigo-600" 
            : darkMode 
              ? "text-gray-400" 
              : "text-gray-500"
        }`}
      />
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={`px-4 pb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} ml-9`}>
            {item.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);