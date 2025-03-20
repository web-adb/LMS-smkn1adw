import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function GET() {
    try {
        // Mengambil daftar pengguna dari Clerk
        const users = await clerkClient.users.getUserList();

        // Format data untuk dikembalikan
        const formattedUsers = users.map((user) => ({
            id: user.id,
            firstName: user.firstName || 'Nama Depan Tidak Tersedia', // Default jika null/undefined
            lastName: user.lastName || 'Nama Belakang Tidak Tersedia', // Default jika null/undefined
            email: user.emailAddresses[0]?.emailAddress || 'Email Tidak Tersedia', // Default jika null/undefined
            profileImageUrl: user.imageUrl || '/default-profile.png', // Default jika null/undefined
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}