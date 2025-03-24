import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';

// GET - Ambil detail hasil quiz
export async function GET(
  req: Request,
  { params }: { params: { quizId: string; resultId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await prisma.quizResult.findUnique({
      where: {
        id: params.resultId,
        quizId: params.quizId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        quiz: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!result) {
      return new NextResponse('Result not found', { status: 404 });
    }

    // Cek apakah user berhak melihat hasil ini
    if (result.userId !== userId && result.quiz.userId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Parse answers dan gabungkan dengan pertanyaan
    const answers = JSON.parse(result.answers as string);
    const detailedResults = answers.map((answer: any) => {
      const question = result.quiz.questions.find(q => q.id === answer.questionId);
      return {
        ...answer,
        questionText: question?.text,
        correctAnswer: question?.correctAnswer,
        options: question ? JSON.parse(question.options) : []
      };
    });

    return NextResponse.json({
      ...result,
      answers: detailedResults,
      quiz: {
        ...result.quiz,
        questions: result.quiz.questions.map(q => ({
          ...q,
          options: JSON.parse(q.options)
        }))
      }
    });
  } catch (error) {
    console.error('[QUIZ_RESULT_DETAIL_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}