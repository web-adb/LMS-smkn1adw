"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    chapterId: string;
    courseId: string;
    playbackId: string;
    youtubeUrl: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
};

export const VideoPlayer = ({
    playbackId,
    youtubeUrl,
    chapterId,
    courseId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);

    const router = useRouter();
    const confetti = useConfettiStore();


    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true
                });

                if (!nextChapterId) {
                    confetti.onOpen();
                }

                toast.success("Progress updated");
                router.refresh();

                if (nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    // Jika tidak ada video, jangan render apa pun
    if (!playbackId && !youtubeUrl) {
        return null;
    }

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8 text-secondary" />
                    <p className="text-sm">This chapter is locked.</p>
                </div>
            )}
            {!isLocked && (
                <>
                    {youtubeUrl ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}`}
                            className="w-full h-full rounded-md"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => setIsReady(true)}
                        />
                    ) : (
                        <MuxPlayer
                            title={title}
                            className={cn(!isReady && "hidden")}
                            onCanPlay={() => setIsReady(true)}
                            onEnded={onEnd}
                            autoPlay
                            playbackId={playbackId}
                        />
                    )}
                </>
            )}
        </div>
    );
};

// Helper function to extract YouTube ID from URL
const extractYouTubeId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};