import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { FileListItem } from './file-list-item';

type Props = {
  files: File[];
  onRemoveFile: (file: File) => void;
};

export function FileList({ files, onRemoveFile }: Props) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
        >
          <FileListItem file={file} />
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer"
            aria-label="Remove file"
            onClick={() => onRemoveFile(file)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
