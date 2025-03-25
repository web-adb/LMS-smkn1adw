import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.union([z.string(), z.number(), z.boolean()]),
    })
  ).min(1),
});

// POST - Submit jawaban quiz
export async function POST(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({
        error: 'Validation failed',
        details: validation.error.errors
      }), { status: 400 });
    }

    const { answers } = validation.data;

    // Cek apakah user sudah pernah submit quiz ini
    const existingResult = await prisma.quizResult.findUnique({
      where: {
        quizId_userId: {
          quizId: params.quizId,
          userId
        }
      }
    });

    if (existingResult) {
      return new NextResponse('Anda Telah Menyelesaikan Quiz Tersebut', { status: 400 });
    }

    // Dapatkan quiz dengan pertanyaan untuk validasi
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: { questions: true }
    });

    if (!quiz) {
      return new NextResponse('Quiz not found', { status: 404 });
    }

    // Validasi deadline
    if (new Date(quiz.deadline) < new Date()) {
      return new NextResponse('Quiz deadline has passed', { status: 400 });
    }

    // Hitung skor
    let score = 0;
    let totalPoints = 0;
    const results: any[] = [];

    answers.forEach((userAnswer) => {
      const question = quiz.questions.find(q => q.id === userAnswer.questionId);
      if (!question) return;

      totalPoints += question.points;
      const isCorrect = checkAnswerCorrectness(question, userAnswer.answer);
      
      if (isCorrect) {
        score += question.points;
      }

      results.push({
        questionId: question.id,
        userAnswer: userAnswer.answer,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    });

    const percentage = Math.round((score / totalPoints) * 100);

    // Simpan hasil
    const result = await prisma.quizResult.create({
      data: {
        quizId: params.quizId,
        userId,
        score: percentage,
        answers: JSON.stringify(results),
      }
    });

    return NextResponse.json({
      score: percentage,
      correctAnswers: score,
      totalPoints,
      totalQuestions: quiz.questions.length,
      resultId: result.id,
      details: results
    });
  } catch (error) {
    console.error('[QUIZ_SUBMIT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Fungsi helper untuk mengecek kebenaran jawaban
function checkAnswerCorrectness(question: any, userAnswer: any): boolean {
  switch (question.type) {
    case 'multiple_choice':
      return userAnswer === question.correctAnswer;
    case 'true_false':
      return userAnswer === Boolean(question.correctAnswer);
    case 'short_answer':
      // Untuk jawaban singkat, bisa diimplementasikan logika lebih kompleks
      // Di sini kita bandingkan string lowercase saja untuk contoh
      const correctAnswers = JSON.parse(question.options);
      return correctAnswers.some((ans: string) => 
        ans.toLowerCase().trim() === String(userAnswer).toLowerCase().trim()
      );
    default:
      return false;
  }
}