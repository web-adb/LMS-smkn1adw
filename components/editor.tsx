"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({
  onChange,
  value,
}: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const editor = document.querySelector(".ql-editor") as HTMLElement;
          const range = window.getSelection()?.getRangeAt(0);
          if (range) {
            range.deleteContents();
            const img = document.createElement("img");
            img.setAttribute("src", reader.result as string);
            range.insertNode(img);
          }
        };
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"], // Include the image button
        ["clean"],
      ],
      handlers: {
        image: imageHandler, // Custom handler for image upload
      },
    },
  }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
};
