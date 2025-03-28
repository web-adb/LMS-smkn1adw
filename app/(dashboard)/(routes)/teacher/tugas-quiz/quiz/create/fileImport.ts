// utils/fileImport.ts
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(reader.error);
    reader.readAsText(file);
  });
};

export const readPdfFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let textContent = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContentObj = await page.getTextContent();
    const pageText = textContentObj.items.map(item => (item as any).str).join(' ');
    textContent += pageText + '\n';
  }

  return textContent;
};

export const readDocxFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const parseQuestionsFromText = (text: string): Question[] => {
  const questions: Question[] = [];
  const lines = text.split('\n').filter(line => line.trim() !== '');

  let currentQuestion: Partial<Question> = {};
  let currentOptions: string[] = [];
  let correctAnswerIndex = -1;

  for (const line of lines) {
    // Detect question (starts with number or Q)
    if (/^\d+[.)]/.test(line) || /^Q\d*[:.)]/.test(line)) {
      // Save previous question if exists
      if (currentQuestion.text && currentOptions.length > 0) {
        questions.push({
          text: currentQuestion.text,
          type: 'multiple_choice',
          options: currentOptions,
          correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
          points: 1
        });
      }

      // Start new question
      currentQuestion = {
        text: line.replace(/^\d+[.)]\s*/, '').replace(/^Q\d*[:.)]\s*/, '').trim()
      };
      currentOptions = [];
      correctAnswerIndex = -1;
    } 
    // Detect options (starts with a letter or *)
    else if (/^[A-Za-z][.)]/.test(line) || /^\*[A-Za-z][.)]/.test(line)) {
      const isCorrect = line.startsWith('*');
      const optionText = line.replace(/^\*?[A-Za-z][.)]\s*/, '').trim();
      
      if (isCorrect) {
        correctAnswerIndex = currentOptions.length;
      }
      currentOptions.push(optionText);
    }
    // Detect true/false question
    else if (/benar|salah|true|false/i.test(line)) {
      currentQuestion = {
        text: line.trim(),
        type: 'true_false',
        options: ['Benar', 'Salah'],
        correctAnswer: /benar|true/i.test(line) ? 0 : 1,
        points: 1
      };
      questions.push(currentQuestion as Question);
      currentQuestion = {};
      currentOptions = [];
    }
    // Detect short answer (ends with ?)
    else if (line.trim().endsWith('?')) {
      currentQuestion = {
        text: line.trim(),
        type: 'short_answer',
        options: [''], // Will be replaced with correct answer
        correctAnswer: 0,
        points: 1,
        correctShortAnswer: '' // User needs to fill this
      };
      questions.push(currentQuestion as Question);
      currentQuestion = {};
      currentOptions = [];
    }
  }

  // Add last question if exists
  if (currentQuestion.text && currentOptions.length > 0) {
    questions.push({
      text: currentQuestion.text,
      type: 'multiple_choice',
      options: currentOptions,
      correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      points: 1
    });
  }

  return questions;
};