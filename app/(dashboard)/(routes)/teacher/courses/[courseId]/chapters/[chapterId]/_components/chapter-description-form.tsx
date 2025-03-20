"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X, Save, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false); // Auto-save off by default
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const editorRef = useRef<any>(null); // Ref untuk mengakses editor

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Fungsi untuk meminta saran AI dari teks yang diblok
  const generateSuggestions = async () => {
    if (!editorRef.current) {
      toast.error("Editor tidak tersedia.");
      return;
    }

    const selectedText = editorRef.current.getSelectedText();

    if (!selectedText) {
      toast.error("Tidak ada teks yang diblok. Silakan blok teks terlebih dahulu.");
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Beri saya 3 saran deskripsi chapter tentang "${selectedText}". Setiap deskripsi maksimal 2 kalimat. Format: 1. Deskripsi 1\n2. Deskripsi 2\n3. Deskripsi 3`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parsing saran dari respons AI
      const suggestions = text
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);

      setSuggestions(suggestions);
    } catch (error) {
      toast.error("Gagal menghasilkan saran. Coba lagi nanti.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Fungsi untuk menerapkan saran ke teks yang diblok
  const applySuggestion = (suggestion: string) => {
    if (!editorRef.current) return;
  
    const editor = editorRef.current.getEditor(); // Menggunakan metode getEditor yang diekspos
    const range = editor.getSelection();
  
    if (range) {
      // Ganti teks yang diblok dengan saran yang dipilih
      editor.deleteText(range.index, range.length);
      editor.insertText(range.index, suggestion);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEditing && isAutoSaveEnabled) {
      interval = setInterval(() => {
        if (isAutoSaveEnabled) {
          form.handleSubmit(onSubmit)();
        }
      }, 10000); // Auto-save setiap 10 detik
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEditing, isAutoSaveEnabled]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "No description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">Edit Description</h2>
            <div className="flex items-center gap-2">
              <Button onClick={toggleEdit} variant="ghost">
                <X className="h-5 w-5 mr-2" />
                Kembali
              </Button>
              <Button
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-5 w-5 mr-2" />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormControl>
                        <div>
                          {/* Toggle Switch untuk Auto-save */}
                          <div className="mb-4 flex items-center gap-2">
                            <label className="text-sm font-medium">
                              Auto-save: {isAutoSaveEnabled ? "On" : "Off"}
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
                              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                                isAutoSaveEnabled ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  isAutoSaveEnabled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Tombol Generate Saran */}
                          <div className="mb-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center gap-x-2 hover:bg-slate-100 transition-all"
                              onClick={generateSuggestions}
                              disabled={isGenerating}
                            >
                              <Sparkles className="h-4 w-4 text-sky-600" />
                              {isGenerating ? "Memproses..." : "Generate Saran"}
                            </Button>
                          </div>

                          {/* Tampilkan Saran AI */}
                          {suggestions.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-slate-600">Saran Deskripsi:</p>
                              <div className="space-y-1">
                                {suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    type="button"
                                    variant="outline"
                                    className="w-full text-left justify-start truncate hover:bg-slate-50 transition-all"
                                    onClick={() => applySuggestion(suggestion)}
                                  >
                                    <span className="truncate">{suggestion}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          <Editor
                            {...field}
                            ref={editorRef}
                            className="h-full w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};