import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the quiz belongs to the user
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: params.quizId,
        userId
      },
      include: {
        _count: {
          select: { results: true }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Get all results for this quiz with user details
    const results = await prisma.quizResult.findMany({
      where: {
        quizId: params.quizId
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

    // Format results with parsed answers
    const formattedResults = results.map(result => ({
      ...result,
      answers: typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers,
      user: {
        id: result.user.id,
        name: result.user.email.split('@')[0], // Using email prefix as name
        email: result.user.email
      }
    }));

    // Calculate average score
    const averageScore = results.length > 0 
      ? results.reduce((sum, result) => sum + result.score, 0) / results.length
      : 0;

    return NextResponse.json({
      results: formattedResults,
      averageScore,
      participantCount: quiz._count.results,
      quizDetails: {
        title: quiz.title,
        description: quiz.description,
        kelas: quiz.kelas,
        deadline: quiz.deadline,
        courseTitle: quiz.course?.title
      }
    });
  } catch (error) {
    console.error('[QUIZ_RESULTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}