'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Mail } from 'lucide-react';

interface User {
  id: string; // Adjust to match your API response
  firstName: string;
  lastName: string;
  email: string;
}

const DaftarSiswa = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p className="text-center text-lg">Loading...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Daftar Siswa</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="text-blue-500" size={32} />
                        </div>
                        <h2
                            className="text-lg font-semibold truncate w-full"
                            title={`${user.firstName} ${user.lastName}`}
                        >
                            {user.firstName} {user.lastName}
                        </h2>
                        <div className="flex items-center justify-center mt-2 text-gray-600">
                            <p className="text-sm truncate w-full">{user.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DaftarSiswa;
