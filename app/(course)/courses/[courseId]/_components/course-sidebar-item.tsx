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
                "flex items-center gap-x-3 w-full text-slate-500 text-sm font-[500] p-3 transition-all hover:bg-slate-100 rounded-lg group",
                isActive && "text-sky-700 bg-sky-100/80 hover:bg-sky-100/90 shadow-sm",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-100/80"
            )}
        >
            <Icon
                size={20}
                className={cn(
                    "text-slate-500 flex-shrink-0 transition-transform",
                    isActive && "text-sky-700 scale-110",
                    isCompleted && "text-emerald-700",
                    !isActive && "group-hover:scale-105"
                )}
            />
            <span className={cn(
                "text-left transition-all duration-200",
                isActive ? "w-full whitespace-normal font-semibold" : "truncate w-[calc(100%-56px)]"
            )}>
                {label}
            </span>
            <div className={cn(
                "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all rounded-full",
                isActive && "opacity-100 border-sky-700",
                isCompleted && "border-emerald-700",
                !isActive && "group-hover:opacity-30"
            )} />
        </button>
    );
};