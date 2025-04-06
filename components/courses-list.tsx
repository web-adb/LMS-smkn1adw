'use client';
import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { BookOpen, ArrowRight, GraduationCap, NotebookPen, LibraryBig, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

const backgroundIcons = [
  { icon: <BookOpen className="w-6 h-6" />, className: "text-blue-500" },
  { icon: <GraduationCap className="w-6 h-6" />, className: "text-green-500" },
  { icon: <NotebookPen className="w-6 h-6" />, className: "text-purple-500" },
  { icon: <LibraryBig className="w-6 h-6" />, className: "text-yellow-500" },
  { icon: <Rocket className="w-6 h-6" />, className: "text-red-500" },
];

export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div className="relative overflow-hidden">
            {/* Animated background icons */}
            <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-5">
                {backgroundIcons.map((bgIcon, index) => (
                    <motion.div
                        key={index}
                        initial={{ 
                            x: Math.random() * 100 - 50,
                            y: Math.random() * 100 - 50,
                            rotate: Math.random() * 360,
                            scale: 0.8
                        }}
                        animate={{
                            x: [null, Math.random() * 100 - 50],
                            y: [null, Math.random() * 100 - 50],
                            rotate: [null, Math.random() * 360],
                            transition: {
                                duration: 30 + Math.random() * 30,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "linear"
                            }
                        }}
                        className={`absolute ${bgIcon.className}`}
                        style={{
                            left: `${10 + (index * 15)}%`,
                            top: `${10 + (index * 10)}%`
                        }}
                    >
                        {bgIcon.icon}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {items.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4"
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        delay: index * 0.05,
                                        duration: 0.3
                                    }
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CourseCard 
                                    id={item.id} 
                                    title={item.title} 
                                    imageUrl={item.imageUrl!} 
                                    chaptersLength={item.chapters.length} 
                                    progress={item.progress} 
                                    category={item?.category?.name!} 
                                    price={item.price!} 
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center gap-6 py-16 text-center max-w-md mx-auto"
                    >
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ 
                                rotate: [0, 5, -5, 0],
                                scale: 1,
                                transition: { 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }
                            }}
                            className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-2xl shadow-sm"
                        >
                            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h3 className="text-xl font-medium">Anda belum mengikuti course</h3>
                            <p className="text-muted-foreground">
                                Mulai jelajahi course yang tersedia dan daftar untuk memulai pembelajaran
                            </p>
                        </div>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button className="mt-2" asChild>
                                <Link href="/search">
                                    Jelajahi Course
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};