"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  videoUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // Isi youtubeLink dengan initialData.youtubeUrl saat komponen pertama kali di-render
  useEffect(() => {
    if (initialData.youtubeUrl) {
      setYoutubeLink(initialData.youtubeUrl);
    }
  }, [initialData.youtubeUrl]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        videoUrl: values.videoUrl || null, // Jika YouTube dipilih, videoUrl di-set null
        youtubeUrl: values.youtubeUrl || null, // Jika upload video dipilih, youtubeUrl di-set null
      };
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, payload);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : initialData.videoUrl || initialData.youtubeUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl && !initialData.youtubeUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {initialData.videoUrl ? (
              <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(initialData.youtubeUrl)}`}
                className="w-full h-full rounded-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url, youtubeUrl: null }); // Hanya set videoUrl, youtubeUrl di-set null
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>

          <div className="mt-4">
            <Input
              placeholder="Paste YouTube link here"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <Button
              className="mt-2"
              onClick={() => {
                const youtubeId = extractYouTubeId(youtubeLink);
                if (youtubeId) {
                  onSubmit({ youtubeUrl: youtubeLink, videoUrl: null }); // Hanya set youtubeUrl, videoUrl di-set null
                } else {
                  toast.error("Invalid YouTube link");
                }
              }}
            >
              Add YouTube Video
            </Button>
          </div>
        </div>
      )}
      {(initialData.videoUrl || initialData.youtubeUrl) && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
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