import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// GET - Ambil detail quiz
export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id: params.quizId,
      },
      include: {
        questions: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        course: {
          select: {
            title: true,
            id: true
          }
        },
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Parse options dari string JSON ke array
    const quizWithParsedOptions = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    };

    return NextResponse.json(quizWithParsedOptions);
  } catch (error) {
    console.error('[QUIZ_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// PATCH - Update quiz
export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, deadline, duration, isRandomized, showScore, questions } = body;

    // Validasi minimal
    if (!title || !questions || questions.length === 0) {
      return new NextResponse('Title and questions are required', { status: 400 });
    }

    // Update quiz
    const updatedQuiz = await prisma.$transaction(async (prisma) => {
      const quiz = await prisma.quiz.update({
        where: {
          id: params.quizId,
          userId // Hanya pemilik yang bisa update
        },
        data: {
          title,
          description,
          deadline: new Date(deadline),
          duration,
          isRandomized,
          showScore
        }
      });

      // Hapus semua pertanyaan lama
      await prisma.question.deleteMany({
        where: {
          quizId: params.quizId
        }
      });

      // Buat pertanyaan baru
      await prisma.question.createMany({
        data: questions.map((q: any) => ({
          ...q,
          quizId: params.quizId,
          options: JSON.stringify(q.options),
        }))
      });

      return quiz;
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('[QUIZ_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// DELETE - Hapus quiz
export async function DELETE(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Hapus quiz (otomatis hapus pertanyaan karena onDelete: Cascade)
    await prisma.quiz.delete({
      where: {
        id: params.quizId,
        userId // Hanya pemilik yang bisa hapus
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[QUIZ_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}