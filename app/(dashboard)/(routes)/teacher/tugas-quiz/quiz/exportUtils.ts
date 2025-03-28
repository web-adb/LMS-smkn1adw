import { Quiz } from "./types";

export function prepareQuizExportData(quizzes: Quiz[]): QuizExportData[] {
  return quizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    kelas: quiz.kelas,
    duration: quiz.duration,
    deadline: quiz.deadline,
    status: new Date(quiz.deadline) > new Date() ? "Aktif" : "Selesai",
    participants: quiz._count?.results || 0,
    courseTitle: quiz.course?.title || "-"
  }));
}

export function exportToCSV(data: QuizExportData[], filename: string) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => 
    Object.values(obj)
      .map(value => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  ).join("\n");

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}