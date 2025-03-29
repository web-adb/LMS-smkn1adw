import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

// POST: Grade an assignment submission
export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { id, nilai, feedback } = body;

    if (!id || nilai === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const updatedSubmission = await prisma.pengumpulanTugas.update({
      where: { id },
      data: {
        nilai,
        feedback,
        selesai: true,
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('[GRADE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}