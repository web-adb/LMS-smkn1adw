import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { tugasId, filePengumpulan, textPengumpulan, userId: studentId } = body;

    if (!tugasId || (!filePengumpulan && !textPengumpulan) || !studentId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if submission already exists
    const existingSubmission = await prisma.pengumpulanTugas.findFirst({
      where: {
        tugasId,
        userId: studentId,
      },
    });

    let submission;
    if (existingSubmission) {
      // Update existing submission
      submission = await prisma.pengumpulanTugas.update({
        where: { id: existingSubmission.id },
        data: {
          filePengumpulan: filePengumpulan || existingSubmission.filePengumpulan,
          textPengumpulan: textPengumpulan || existingSubmission.textPengumpulan,
          dikumpulkanPada: new Date(),
          dikumpulkan: true,
        },
      });
    } else {
      // Create new submission
      submission = await prisma.pengumpulanTugas.create({
        data: {
          tugasId,
          userId: studentId,
          filePengumpulan,
          textPengumpulan,
          dikumpulkan: true,
        },
      });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('[SUBMISSION_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}