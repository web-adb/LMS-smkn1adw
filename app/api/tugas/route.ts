import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Ambil semua tugas
export async function GET() {
  try {
    const tugas = await prisma.tugas.findMany();
    return NextResponse.json(tugas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data tugas' },
      { status: 500 }
    );
  }
}

// POST: Buat tugas baru (untuk guru)
export async function POST(request: Request) {
  try {
    const { judul, deskripsi, deadline, lampiran } = await request.json();
    const tugas = await prisma.tugas.create({
      data: {
        judul,
        deskripsi,
        deadline: new Date(deadline),
        lampiran,
      },
    });
    return NextResponse.json(tugas, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal membuat tugas' },
      { status: 500 }
    );
  }
}

// PUT: Update status tugas (mengumpulkan/menandai selesai)
export async function PUT(request: Request) {
  try {
    const { id, selesai, dikumpulkan } = await request.json();
    const tugas = await prisma.tugas.update({
      where: { id },
      data: { selesai, dikumpulkan },
    });
    return NextResponse.json(tugas, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengupdate tugas' },
      { status: 500 }
    );
  }
}