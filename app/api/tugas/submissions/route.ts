import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

// GET: Get all submissions for a specific assignment
export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tugasId = searchParams.get('tugasId');

    if (!tugasId) {
      return new NextResponse('Tugas ID is required', { status: 400 });
    }

    const submissions = await prisma.pengumpulanTugas.findMany({
      where: {
        tugasId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        dikumpulkanPada: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('[SUBMISSIONS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}