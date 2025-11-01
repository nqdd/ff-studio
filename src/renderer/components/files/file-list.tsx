import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { FileListItem, FileListItemConvertStatus } from './file-list-item';
import type { OutputFormat, ConversionFile } from '../../stores/file';

type Props = {
  files: ConversionFile[];
  onRemoveFile: (file: ConversionFile) => void;
  onChangeOutputFormat: (
    file: ConversionFile,
    outputFormat: OutputFormat,
  ) => void;
};

export function FileList({ files, onRemoveFile, onChangeOutputFormat }: Props) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={`${file.path}`}
          className="flex items-center justify-between gap-2 p-3 bg-secondary/50 rounded-lg"
        >
          <FileListItem
            file={file}
            outputFormat={file.outputFormat}
            onChangeOutputFormat={(outputFormat) =>
              onChangeOutputFormat(file, outputFormat)
            }
          />
          {file.status === 'idle' && (
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              aria-label="Remove file"
              onClick={() => onRemoveFile(file)}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <FileListItemConvertStatus status={file.status} />
        </div>
      ))}
    </div>
  );
}
