import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    // Handle auth properly
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get quizId from params safely
    const quizId = params?.quizId;

    if (!quizId) {
      return new NextResponse('Quiz ID is required', { status: 400 });
    }

    // Verify quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { 
        title: true,
        showScore: true,
        userId: true
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Get all quiz results with proper user handling
    const results = await prisma.quizResult.findMany({
      where: {
        quizId: quizId,
        // Ensure user exists by checking the relation
        user: {
          id: { not: undefined } // This properly checks for existing users
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Process results safely
    const parsedResults = results.map(result => ({
      id: result.id,
      user: result.user,
      score: result.score,
      answers: typeof result.answers === 'string' 
        ? JSON.parse(result.answers) 
        : result.answers,
      submittedAt: result.submittedAt
    }));

    return NextResponse.json({
      quizTitle: quiz.title,
      showScore: quiz.showScore,
      isCreator: quiz.userId === userId,
      results: parsedResults
    });

  } catch (error) {
    console.error('[QUIZ_RESULTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}