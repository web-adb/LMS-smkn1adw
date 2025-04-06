import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    // Await the params promise to get the actual values
    const { quizId } = await params;
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has submitted this quiz
    const result = await prisma.quizResult.findFirst({
      where: {
        quizId,
        userId
      },
      include: {
        quiz: {
          select: {
            deadline: true
          }
        }
      }
    });

    if (!result) {
      return NextResponse.json({ submitted: false });
    }

    // Parse answers safely
    let details: Array<{ isCorrect?: boolean }> = [];
    try {
      details = typeof result.answers === 'string' 
        ? JSON.parse(result.answers) 
        : result.answers || [];
    } catch (e) {
      console.error("Error parsing answers:", e);
      details = [];
    }

    return NextResponse.json({
      submitted: true,
      result: {
        id: result.id,
        score: result.score,
        correctAnswers: details.filter(d => d.isCorrect).length,
        totalQuestions: details.length,
        details,
        submittedAt: result.submittedAt.toISOString()
      },
      quizDeadline: result.quiz.deadline?.toISOString() || null
    });

  } catch (error) {
    console.error('[QUIZ_RESULTS_ME]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Type for the response
export interface QuizResultMeResponse {
  submitted: boolean;
  result?: {
    id: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    details: Array<{ isCorrect?: boolean }>;
    submittedAt: string;
  };
  quizDeadline?: string | null;
  error?: string;
}