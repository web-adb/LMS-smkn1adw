import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function GET() {
    try {
        // Mengambil daftar pengguna dari Clerk
        const users = await clerkClient.users.getUserList();

        // Format data untuk dikembalikan
        const formattedUsers = users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0]?.emailAddress,
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
