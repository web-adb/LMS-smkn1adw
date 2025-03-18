"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen, X, Check, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Judul wajib diisi",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false); // State untuk loading redirect

  // Fungsi untuk meminta saran AI
  const generateSuggestions = async (input: string) => {
    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Beri saya 3 saran judul kursus tentang ${input}. Setiap judul maksimal 10 kata. Format: 1. Judul 1\n2. Judul 2\n3. Judul 3`;
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsRedirecting(true); // Mulai proses redirect
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Kursus berhasil dibuat");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsRedirecting(false); // Selesai proses redirect
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full max-w-md">
        {/* Header dengan Ikon */}
        <div className="flex items-center gap-x-2 mb-6">
          <BookOpen className="h-8 w-8 text-sky-600" />
          <h1 className="text-2xl font-bold">Beri Nama Kursus Anda</h1>
        </div>
        <p className="text-sm text-slate-600 mb-8">
          Apa nama yang ingin Anda berikan untuk kursus ini? Jangan khawatir, Anda bisa mengubahnya nanti.
        </p>

        {/* Form Input */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Judul Kursus
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isSubmitting || isRedirecting} // Nonaktifkan input saat loading
                        placeholder="Contoh: 'Pengembangan Web Tingkat Lanjut'"
                        className="focus:ring-2 focus:ring-sky-500 border-slate-300 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => generateSuggestions(field.value)}
                        disabled={isGenerating || !field.value.trim() || isRedirecting} // Nonaktifkan tombol saat loading
                      >
                        {isGenerating ? (
                          "Memproses..."
                        ) : (
                          <Sparkles className="h-4 w-4 text-sky-600" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm text-slate-500">
                    Apa yang akan Anda ajarkan dalam kursus ini?
                  </FormDescription>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            {/* Tampilkan Saran AI */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Saran Judul:</p>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className="w-full text-left justify-start truncate"
                      onClick={() => form.setValue("title", suggestion)}
                      disabled={isRedirecting} // Nonaktifkan tombol saran saat loading
                    >
                      <span className="truncate">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex items-center gap-x-4">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center gap-x-2 hover:bg-slate-100"
                  disabled={isRedirecting} // Nonaktifkan tombol batal saat loading
                >
                  <X className="h-4 w-4" />
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting || isRedirecting} // Nonaktifkan tombol lanjut saat loading
                className="flex items-center gap-x-2 bg-sky-600 hover:bg-sky-700 text-white"
              >
                {isRedirecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" /> // Tampilkan spinner saat loading
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Lanjut
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;