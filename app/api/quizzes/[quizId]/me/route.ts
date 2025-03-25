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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has submitted this quiz
    const result = await prisma.quizResult.findFirst({
      where: {
        quizId: params.quizId,
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
    let details = [];
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
        correctAnswers: details.filter((d: any) => d.isCorrect).length,
        totalQuestions: details.length,
        details,
        submittedAt: result.submittedAt.toISOString()
      },
      quizDeadline: result.quiz.deadline.toISOString()
    });

  } catch (error) {
    console.error('[QUIZ_RESULTS_ME]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}