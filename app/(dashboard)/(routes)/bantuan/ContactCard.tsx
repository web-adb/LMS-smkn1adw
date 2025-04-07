import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { ContactMethod } from "./types";

interface ContactCardProps {
  contact: ContactMethod;
  darkMode: boolean;
}

export const ContactCard = ({ contact, darkMode }: ContactCardProps) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className={`rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex gap-4">
      <div className={`p-3 rounded-full flex-shrink-0 ${
        darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {contact.icon}
      </div>
      <div>
        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {contact.name}
        </h3>
        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {contact.value}
        </p>
        {contact.description && (
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {contact.description}
          </p>
        )}
        {contact.action && (
          <a
            href={contact.href}
            className={`inline-flex items-center mt-3 text-sm font-medium ${
              darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            {contact.action}
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        )}
        {contact.available && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            <Clock className="w-3 h-3" />
            {contact.available}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);