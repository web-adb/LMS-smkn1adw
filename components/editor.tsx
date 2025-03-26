"use client";

import dynamic from "next/dynamic";
import { useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";


interface EditorProps { 
  onChange: (value: string) => void;
  value: string;
  className?: string;
}

export const Editor = forwardRef<any, EditorProps>(
  ({ onChange, value, className }, ref) => {
    const ReactQuillNew = useMemo(
      () =>
        dynamic(() => import("react-quill-new"), {
          ssr: false,
          loading: () => <p>Loading editor...</p>,
        }),
      []
    );

    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
        ["undo", "redo"],
      ],
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true,
      },
    };

    // Ref untuk mengakses instance Quill
    const quillRef = useRef<any>(null);

    // Ekspos metode getEditor dan getSelectedText melalui ref
    
    useImperativeHandle(ref, () => ({
      getEditor: () => {
        if (quillRef.current) {
          return quillRef.current.getEditor();
        }
        return null;
      },
      getSelectedText: () => {
        if (quillRef.current) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          if (range) {
            return editor.getText(range.index, range.length);
          }
        }
        return null;
      },
    }));

    return (
      <div className={className}>
        <ReactQuillNew
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          ref={(el: any) => {
            if (el) {
              quillRef.current = el; // Simpan instance Quill ke ref
            }
          }
        }
        />
      </div>
    );
  }
);

Editor.displayName = "Editor";