"use client";
import React, { useState } from "react";

interface FileUploadProps {
  onFileSelect: (fileText: string, fileName: string) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      // Read file content as text (basic extraction)
      const text = await file.text();

      // ✅ Instead of immediately sending it, just pass to parent for preview
      onFileSelect(text, file.name);
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  return (
    <label
      htmlFor="file-upload"
      className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
      title="Upload file"
    >
      📎
      <input
        id="file-upload"
        type="file"
        accept=".txt,.pdf,.doc,.docx,.json,.csv,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
