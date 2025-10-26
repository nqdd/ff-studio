import { FileImage } from 'lucide-react';

type Props = {
  file: File;
};

export function FileListItem({ file }: Props) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <FileImage className="w-6 h-6" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
