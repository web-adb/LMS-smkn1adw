import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
): Promise<NextResponse> {
  try {
    // Await the params promise to get the actual values
    const { quizId } = await params;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify the quiz belongs to the user
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
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
        quizId
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
    const formattedResults = results.map(result => {
      let answers: any = [];
      try {
        answers = typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers;
      } catch (e) {
        console.error('Error parsing answers:', e);
        answers = [];
      }

      return {
        ...result,
        answers,
        user: {
          id: result.user.id,
          name: result.user.email.split('@')[0], // Using email prefix as name
          email: result.user.email
        }
      };
    });

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
        deadline: quiz.deadline?.toISOString() || null,
        courseTitle: quiz.course?.title
      }
    });
  } catch (error) {
    console.error('[QUIZ_RESULTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Response type interface
export interface QuizResultsResponse {
  results: Array<{
    id: string;
    score: number;
    answers: any[];
    submittedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  averageScore: number;
  participantCount: number;
  quizDetails: {
    title: string;
    description: string | null;
    kelas: string | null;
    deadline: string | null;
    courseTitle: string | null;
  };
}