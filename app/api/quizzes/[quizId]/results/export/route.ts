import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import ExcelJS from 'exceljs';

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
        questions: true,
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

    // Get all results for this quiz
    const results = await prisma.quizResult.findMany({
      where: {
        quizId: params.quizId
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hasil Quiz');

    // Add headers
    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Nilai (%)', key: 'score', width: 10 },
      { header: 'Waktu Submit', key: 'submittedAt', width: 20 },
      ...quiz.questions.map((q, i) => ({
        header: `Q${i+1}`,
        key: `q${i+1}`,
        width: 15
      }))
    ];

    // Add data rows
    results.forEach((result, index) => {
      const answers = typeof result.answers === 'string' 
        ? JSON.parse(result.answers) 
        : result.answers;
      
      const rowData: any = {
        no: index + 1,
        name: result.user.email.split('@')[0], // Using email prefix as name
        email: result.user.email,
        score: result.score,
        submittedAt: new Date(result.submittedAt).toLocaleString('id-ID')
      };

      // Add question answers
      quiz.questions.forEach((question, qIndex) => {
        const answer = answers.find((a: any) => a.questionId === question.id);
        rowData[`q${qIndex+1}`] = answer 
          ? `${answer.userAnswer} (${answer.isCorrect ? '✓' : '✗'})` 
          : '-';
      });

      worksheet.addRow(rowData);
    });

    // Add quiz info sheet
    const infoSheet = workbook.addWorksheet('Info Quiz');
    infoSheet.columns = [
      { header: 'Kategori', key: 'key', width: 20 },
      { header: 'Detail', key: 'value', width: 40 }
    ];
    
    infoSheet.addRows([
      { key: 'Judul Quiz', value: quiz.title },
      { key: 'Deskripsi', value: quiz.description || '-' },
      { key: 'Mata Pelajaran', value: quiz.course?.title || '-' },
      { key: 'Kelas', value: quiz.kelas },
      { key: 'Jumlah Pertanyaan', value: quiz.questions.length },
      { key: 'Jumlah Peserta', value: results.length },
      { key: 'Rata-rata Nilai', value: `${(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}%` }
    ]);

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=hasil-quiz-${quiz.title.replace(/[^a-z0-9]/gi, '_')}.xlsx`
      }
    });
  } catch (error) {
    console.error('[QUIZ_RESULTS_EXPORT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}