import type React from 'react';

import { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { Button } from './ui/button';

type FileUploadProps = {
  onFilesSelected: (input: HTMLInputElement) => void;
};

export function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
      onFilesSelected(fileInputRef.current);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target instanceof HTMLInputElement) {
      onFilesSelected(e.target);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="w-full flex items-center justify-center mb-2">
        <CloudUpload className="w-12 h-12" />
      </div>
      <p className="text-foreground font-medium mb-1">
        Drag and drop your files here
      </p>
      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
      <label htmlFor="file-input">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <Button
          asChild
          variant="outline"
          className="cursor-pointer bg-transparent"
        >
          <span>Browse Files</span>
        </Button>
      </label>
    </div>
  );
}
