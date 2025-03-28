"use client";

import toast from "react-hot-toast";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  onUploadStart?: () => void;
}

export const FileUpload = ({
  onChange,
  endpoint,
  onUploadStart
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`Gagal mengunggah: ${error?.message}`);
      }}
      onUploadBegin={() => {
        onUploadStart?.();
      }}
      appearance={{
        button: "bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2",
        container: "border-2 border-dashed border-gray-300 rounded-xl",
        allowedContent: "text-gray-500 text-sm",
      }}
    />
  );
};