import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

// GET - Ambil hasil quiz
export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Cek apakah user adalah pembuat quiz atau peserta
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      select: { userId: true }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    const isCreator = quiz.userId === userId;

    // Untuk creator: dapatkan semua hasil
    // Untuk peserta: dapatkan hasil mereka saja
    const results = await prisma.quizResult.findMany({
      where: {
        quizId: params.quizId,
        ...(!isCreator ? { userId } : {}) // Filter untuk non-creator
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        quiz: {
          select: {
            title: true,
            showScore: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Parse answers dari string JSON ke array
    const parsedResults = results.map(result => ({
      ...result,
      answers: JSON.parse(result.answers as string)
    }));

    return NextResponse.json({
      isCreator,
      results: parsedResults
    });
  } catch (error) {
    console.error('[QUIZ_RESULTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}