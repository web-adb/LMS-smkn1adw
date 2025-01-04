"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const [wordCount, setWordCount] = useState(0);

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
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            range.insertNode(img);
          }
        };
      }
    };
  };

  const videoHandler = () => {
    const url = prompt("Enter the video URL:");
    if (url) {
      const editor = document.querySelector(".ql-editor") as HTMLElement;
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", url);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.width = "100%";
        iframe.style.height = "315px";
        range.insertNode(iframe);
      }
    }
  };

  const handleDragAndDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const editor = document.querySelector(".ql-editor") as HTMLElement;
        const range = window.getSelection()?.getRangeAt(0);
        if (range) {
          range.deleteContents();
          const img = document.createElement("img");
          img.setAttribute("src", reader.result as string);
          img.style.maxWidth = "100%";
          img.style.height = "auto";
          range.insertNode(img);
        }
      };
    }
  };

  const calculateWordCount = (text: string) => {
    const words = text.replace(/<[^>]+>/g, "").trim().split(/\s+/);
    setWordCount(words.filter((word) => word).length);
  };

  useEffect(() => {
    calculateWordCount(value);
  }, [value]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            { font: [] },
            { size: [] },
            { align: [] },
          ], // Font family, size, alignment
          ["bold", "italic", "underline", "strike"], // Styling
          [{ list: "ordered" }, { list: "bullet" }], // Lists
          [
            {
              lineheight: [
                "1",
                "1.5",
                "2",
                "2.5",
                "3",
              ],
            },
          ], // Line-height (spacing between text lines)
          [{ indent: "-1" }, { indent: "+1" }], // Indentation
          [{ color: [] }, { background: [] }], // Text and background color
          ["link", "image", "video", "code-block", "formula"], // Media and blocks
          ["clean"], // Clear format
          ["undo", "redo"], // Undo/Redo
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "bullet",
    "indent",
    "lineheight",
    "color",
    "background",
    "link",
    "image",
    "video",
    "code-block",
    "formula",
  ];

  return (
    <div
      className="bg-white p-4 border border-gray-300 rounded-md"
      onDrop={handleDragAndDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(content) => {
          onChange(content);
          calculateWordCount(content);
        }}
        modules={modules}
        formats={formats}
      />
      <div className="mt-2 text-sm text-gray-500">
        Word Count: {wordCount}
      </div>
    </div>
  );
};
