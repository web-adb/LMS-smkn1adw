import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { BookOpen, LayoutDashboard, Menu, FileText, Award, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
};

export const CourseSidebar = async({
    course,
    progressCount
}: CourseSidebarProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white dark:bg-gray-800">
            <div className="p-6 flex flex-col border-b dark:border-gray-700">
                <h1 className="font-bold text-xl text-gray-800 dark:text-white">{course.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <BookOpen className="h-4 w-4" />
                    <span>Course Content</span>
                </div>
                
                {purchase && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Progress</span>
                            <span className="text-sm font-bold text-primary">{progressCount}%</span>
                        </div>
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                        Course Chapters
                    </h3>
                </div>
                
                <nav className="flex-1 p-2">
                    {course.chapters.map((chapter) => (
                        <CourseSidebarItem
                            key={chapter.id}
                            id={chapter.id}
                            label={chapter.title}
                            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!chapter.isFree && !purchase}
                        />
                    ))}
                </nav>
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                        <Award className="h-4 w-4" />
                        <span>Certificate</span>
                    </button>
                </div>
            </div>
        </div>
    );
};