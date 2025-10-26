import type React from 'react';

import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { useFileStore } from '../stores/file';
import { FileList } from './files/file-list';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const files = useFileStore((state) => state.files);
  const setFiles = useFileStore((state) => state.addFile);
  const removeFile = useFileStore((state) => state.removeFile);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>Add images or videos to convert</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <label htmlFor="file-input">
            <input
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

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Selected Files ({files.length})
            </p>
            <div className="max-h-48 overflow-y-auto">
              <FileList files={files} onRemoveFile={removeFile} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
