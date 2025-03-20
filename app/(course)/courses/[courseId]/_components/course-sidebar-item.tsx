"use client";

import { CheckCheck, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked
}: CourseSidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCheck : PlayCircle);
    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    };

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-3 w-full text-slate-500 text-sm font-[500] p-3 transition-all hover:bg-slate-100 rounded-lg",
                isActive && "text-sky-700 bg-sky-100 hover:bg-sky-100",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-100"
            )}
        >
            <Icon
                size={20}
                className={cn(
                    "text-slate-500 flex-shrink-0",
                    isActive && "text-sky-700",
                    isCompleted && "text-emerald-700"
                )}
            />
            <span className="text-left truncate">{label}</span>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                isActive && "opacity-100",
                isCompleted && "border-emerald-700"
            )} />
        </button>
    );
};