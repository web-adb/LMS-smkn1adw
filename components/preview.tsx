"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css"; // Update the CSS import

interface PreviewProps {
  value: string;
}

export const Preview = ({
  value,
}: PreviewProps) => {
  const ReactQuillNew = useMemo(() => dynamic(() => import("react-quill-new"), { ssr: false }), []);

  return (
    <ReactQuillNew
      theme="bubble"
      value={value}
      readOnly
    />
  );
};