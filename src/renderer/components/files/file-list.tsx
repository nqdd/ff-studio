import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { FileListItem } from './file-list-item';
import type { OutputFormat, StoredFile } from '../../stores/file';

type Props = {
  files: StoredFile[];
  onRemoveFile: (file: File) => void;
  onChangeOutputFormat: (file: File, outputFormat: OutputFormat) => void;
};

export function FileList({ files, onRemoveFile, onChangeOutputFormat }: Props) {
  return (
    <div className="space-y-2">
      {files.map((storedFile, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={`${storedFile.file.name}-${index}`}
          className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
        >
          <FileListItem
            file={storedFile.file}
            outputFormat={storedFile.outputFormat}
            onChangeOutputFormat={(outputFormat) =>
              onChangeOutputFormat(storedFile.file, outputFormat)
            }
          />
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer"
            aria-label="Remove file"
            onClick={() => onRemoveFile(storedFile.file)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
