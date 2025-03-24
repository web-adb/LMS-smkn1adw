import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema validasi
const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  kelas: z.string().min(1),
  duration: z.number().min(1),
  deadline: z.string().datetime(),
  isRandomized: z.boolean().default(false),
  showScore: z.boolean().default(true),
  courseId: z.string().optional(),
  questions: z.array(
    z.object({
      text: z.string().min(1),
      type: z.enum(['multiple_choice', 'true_false', 'short_answer']),
      options: z.array(z.string().min(1)),
      correctAnswer: z.number().min(0),
      points: z.number().min(1),
    })
  ).min(1),
});

// GET - Ambil semua quiz dengan statistik
export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const withStats = searchParams.get('withStats') === 'true';
    const courseId = searchParams.get('courseId');
    const kelas = searchParams.get('kelas');

    // Get quizzes
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId, // Only show quizzes created by this user
        ...(courseId ? { courseId } : {}),
        ...(kelas ? { kelas } : {}),
      },
      include: {
        questions: true,
        course: {
          select: {
            title: true,
            id: true
          }
        },
        _count: {
          select: { results: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format response
    const quizzesWithStats = quizzes.map(quiz => ({
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      })),
      peserta: 30, // Default value, replace with actual participant count logic
      submitted: quiz._count.results,
    }));

    if (!withStats) {
      return NextResponse.json({ quizzes: quizzesWithStats });
    }

    // Calculate stats
    const totalQuizzes = quizzes.length;
    const activeQuizzes = quizzes.filter(q => new Date(q.deadline) > new Date()).length;
    
    // Count quizzes that need grading (quizzes with ungraded submissions)
    const quizzesWithResults = await prisma.quiz.findMany({
      where: {
        userId,
        results: {
          some: {}
        }
      },
      include: {
        results: true
      }
    });

    const quizzesNeedGrading = quizzesWithResults.filter(quiz => {
      // Implement your grading status logic here
      return false; // Placeholder
    }).length;
    
    // Calculate average score
    const allResults = await prisma.quizResult.findMany({
      where: {
        quiz: {
          userId
        }
      }
    });

    const averageScore = allResults.length > 0 
      ? allResults.reduce((sum, result) => sum + result.score, 0) / allResults.length
      : 0;

    return NextResponse.json({
      quizzes: quizzesWithStats,
      totalQuizzes,
      activeQuizzes,
      quizzesNeedGrading,
      averageScore
    });
  } catch (error) {
    console.error('[QUIZZES_GET]', error);
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