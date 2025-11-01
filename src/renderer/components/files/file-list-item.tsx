import {
  CircleCheck,
  CircleX,
  FileImage,
  FileVideo,
  LoaderCircle,
} from 'lucide-react';
import {
  ConversionFile,
  ConversionStatus,
  IMAGE_OUTPUT_FORMATS,
  type OutputFormat,
  VIDEO_OUTPUT_FORMATS,
} from '../../stores/file';

type Props = {
  file: ConversionFile;
  outputFormat: OutputFormat;
  onChangeOutputFormat: (outputFormat: OutputFormat) => void;
};

export function FileListItem({
  file,
  outputFormat,
  onChangeOutputFormat,
}: Props) {
  const isVideo = file?.type?.startsWith('video/');
  const Icon = isVideo ? FileVideo : FileImage;
  const availableFormats = isVideo
    ? VIDEO_OUTPUT_FORMATS
    : IMAGE_OUTPUT_FORMATS;

  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="w-6 h-6 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <select
        aria-label="Select output file type"
        className="h-8 px-2 rounded-md border border-border bg-background text-sm text-foreground"
        value={outputFormat}
        onChange={(event) =>
          onChangeOutputFormat(event.target.value as OutputFormat)
        }
      >
        {availableFormats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FileListItemConvertStatus({
  status,
}: {
  status: ConversionStatus;
}) {
  if (status === 'running') {
    return <LoaderCircle className="text-blue-400 animate-spin" />;
  }

  if (status === 'success') {
    return <CircleCheck className="text-green-400" />;
  }

  if (status === 'error') {
    return <CircleX className="text-red-400" />;
  }

  return null;
}
