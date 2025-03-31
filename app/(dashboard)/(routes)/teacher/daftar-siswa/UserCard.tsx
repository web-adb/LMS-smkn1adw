import { UserIcon, Mail, Check, Copy } from 'lucide-react';
import { User } from './types';
import { useState } from 'react';

interface UserCardProps {
  user: User;
  viewMode: 'grid' | 'list';
  isHighlighted?: boolean;
  onClick?: () => void;
}

const UserCard = ({ user, viewMode, isHighlighted = false, onClick }: UserCardProps) => {
  const [copiedItem, setCopiedItem] = useState<'name' | 'email' | null>(null);
  
  const copyToClipboard = (text: string, type: 'name' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const cardClasses = `rounded-lg p-4 hover:shadow-xl transition-all duration-300 ${
    isHighlighted 
      ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
      : 'shadow-lg dark:shadow-gray-700/30'
  } ${
    onClick ? 'cursor-pointer' : ''
  }`;

  const gridModeClasses = `bg-white dark:bg-gray-800 ${cardClasses} flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 group`;
  const listModeClasses = `bg-white dark:bg-gray-800 ${cardClasses} flex items-center space-x-4 border border-gray-200 dark:border-gray-700 group`;

  const avatarContainerClasses = "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden";
  const defaultAvatarClasses = "w-full h-full flex items-center justify-center bg-blue-500 dark:bg-blue-600";
  const emailBadgeClasses = "text-sm font-medium px-3 py-1 rounded-full truncate bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";

  if (viewMode === 'grid') {
    return (
      <div 
        className={gridModeClasses}
        onClick={onClick}
      >
        <div className={`${avatarContainerClasses} mb-4`}>
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={defaultAvatarClasses}>
              <UserIcon className="text-white" size={32} />
            </div>
          )}
        </div>

        <div className="relative w-full">
          <h2
            className="text-lg font-semibold truncate w-full text-gray-800 dark:text-gray-200 group-hover:pr-6 transition-all"
            title={`${user.firstName} ${user.lastName}`}
          >
            {user.firstName} {user.lastName}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(`${user.firstName} ${user.lastName}`, 'name');
            }}
            className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            aria-label="Copy name"
          >
            {copiedItem === 'name' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="mt-2 w-full relative">
          <div className={`${emailBadgeClasses} group-hover:pr-8 transition-all`}>
            {user.email}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(user.email, 'email');
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-800 dark:text-blue-200"
            aria-label="Copy email"
          >
            {copiedItem === 'email' ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {user.status === 'inactive' && (
          <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full">
            Tidak Aktif
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={listModeClasses}
      onClick={onClick}
    >
      <div className={avatarContainerClasses}>
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={defaultAvatarClasses}>
            <UserIcon className="text-white" size={32} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="relative">
          <h2 className="text-lg font-semibold truncate text-gray-800 dark:text-gray-200 group-hover:pr-6">
            {user.firstName} {user.lastName}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(`${user.firstName} ${user.lastName}`, 'name');
            }}
            className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            aria-label="Copy name"
          >
            {copiedItem === 'name' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        
        <div className="relative">
          <div className={`${emailBadgeClasses} inline-block group-hover:pr-8`}>
            {user.email}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(user.email, 'email');
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-800 dark:text-blue-200"
            aria-label="Copy email"
          >
            {copiedItem === 'email' ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {user.status === 'inactive' && (
        <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full">
          Tidak Aktif
        </div>
      )}
    </div>
  );
};

export default UserCard;