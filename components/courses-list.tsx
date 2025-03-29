import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}
export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard key={item.id} id={item.id} title={item.title} imageUrl={item.imageUrl!} chaptersLength={item.chapters.length} progress={item.progress} category={item?.category?.name!} price={item.price!} />
                ))}
            </div>
            {items.length === 0 && (
<div className="flex flex-col items-center justify-center gap-4 py-12 text-center max-w-md mx-auto">
  <div className="bg-muted/50 p-6 rounded-full">
    <BookOpen className="w-10 h-10 text-muted-foreground" />
  </div>
  
  <div className="space-y-2">
    <h3 className="text-lg font-medium">Anda belum mengikuti course</h3>
    <p className="text-sm text-muted-foreground">
      Mulai jelajahi course yang tersedia dan daftar untuk memulai pembelajaran
    </p>
  </div>
  
  <Button className="mt-4" asChild>
    <Link href="/search">
      Jelajahi Course
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  </Button>
</div>
            )}
        </div>
    );
};