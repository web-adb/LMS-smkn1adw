// app/api/certificates/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Mengambil userId dari Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse body request
    const { title, description, imageUrl, studentEmails } = await request.json();

    // Simpan sertifikat untuk setiap siswa
    const certificates = await Promise.all(
      studentEmails.map(async (email: string) => {
        // Cari siswa berdasarkan email di database Prisma
        let student = await prisma.user.findUnique({
          where: { email },
        });

        // Jika siswa tidak ditemukan, sinkronkan data dari Clerk ke Prisma
        if (!student) {
          const clerkUsers = await clerkClient.users.getUserList({ emailAddress: [email] });

          if (clerkUsers.length === 0) {
            throw new Error(`Siswa dengan email ${email} tidak ditemukan di Clerk`);
          }

          const clerkUser = clerkUsers[0];

          // Simpan data pengguna ke database Prisma
          student = await prisma.user.create({
            data: {
              id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || email,
            },
          });
        }

        // Simpan sertifikat ke database
        return prisma.certificate.create({
          data: {
            title,
            description,
            imageUrl,
            date: new Date(),
            userId: student.id, // Siswa yang menerima sertifikat
            teacherId: userId, // Guru yang mengupload sertifikat
          },
        });
      }),
    );

    return NextResponse.json(certificates, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan sertifikat' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    // Mengambil userId dari Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil sertifikat berdasarkan userId siswa
    const certificates = await prisma.certificate.findMany({
      where: { userId },
    });

    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil sertifikat' },
      { status: 500 },
    );
  }
}