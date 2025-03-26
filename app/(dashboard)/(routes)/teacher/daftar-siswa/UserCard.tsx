import { UserIcon, Mail } from 'lucide-react';
import { User } from './types';

interface UserCardProps {
  user: User;
  viewMode: 'grid' | 'list';
}

const UserCard = ({ user, viewMode }: UserCardProps) => {
  if (viewMode === 'grid') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 flex items-center justify-center">
              <UserIcon className="text-white" size={32} />
            </div>
          )}
        </div>

        <h2
          className="text-lg font-semibold truncate w-full"
          title={`${user.firstName} ${user.lastName}`}
        >
          {user.firstName} {user.lastName}
        </h2>

        <div className="mt-2 w-full">
          <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full truncate">
            {user.email}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-500 flex items-center justify-center">
            <UserIcon className="text-white" size={32} />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold truncate">
          {user.firstName} {user.lastName}
        </h2>
        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full truncate">
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserCard;