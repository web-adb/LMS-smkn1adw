import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

// Handler untuk GET (mengambil data pengguna)
export async function GET() {
    try {
        const users = await clerkClient.users.getUserList();

        const formattedUsers = users.map((user) => ({
            id: user.id,
            firstName: user.firstName || 'Nama Depan Tidak Tersedia',
            lastName: user.lastName || 'Nama Belakang Tidak Tersedia',
            email: user.emailAddresses[0]?.emailAddress || 'Email Tidak Tersedia',
            profileImageUrl: user.imageUrl || '/default-profile.png',
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// Handler untuk PUT (memperbarui data pengguna)
export async function PUT(request: Request) {
    try {
        const { userId, username, oldPassword, newPassword } = await request.json();

        // Perbarui username
        if (username) {
            await clerkClient.users.updateUser(userId, {
                username,
            });
        }

        // Perbarui password
        if (oldPassword && newPassword) {
            await clerkClient.users.updateUserPassword({
                userId,
                currentPassword: oldPassword,
                newPassword,
            });
        }

        return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui!' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
    }
}