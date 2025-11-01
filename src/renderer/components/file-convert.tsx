import { useEffect, useMemo, useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { useFileStore } from '../stores/file';

type ConversionStatus = 'idle' | 'running' | 'success' | 'error';

type FileWithPath = File & {
  path?: string;
};

export function FileConvert() {
  const files = useFileStore((state) => state.files);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const hasFiles = files.length > 0;
  const disableConvert = !hasFiles || status === 'running';

  const summaryLabel = useMemo(() => {
    if (!hasFiles) {
      return 'Convert';
    }
    return `Convert ${files.length} ${files.length > 1 ? 'files' : 'file'}`;
  }, [files.length, hasFiles]);

  const statusDetails = useMemo(() => {
    switch (status) {
      case 'success':
        return {
          className: 'text-green-600 dark:text-green-400',
          message: 'Conversion finished successfully.',
        };
      case 'error':
        return {
          className: 'text-destructive',
          message: 'Conversion failed. Check the logs below.',
        };
      case 'running':
        return {
          className: 'text-muted-foreground',
          message: 'Conversion in progress…',
        };
      default:
        return {
          className: '',
          message: '',
        };
    }
  }, [status]);

  useEffect(() => {
    if (!window?.electron?.ipcRenderer) {
      return () => {};
    }

    const unsubscribe = window.electron.ipcRenderer.on('log', (message) => {
      const text = String(message);
      setLogs((prev) => [...prev, text]);

      if (text.includes('FFmpeg process exited with code')) {
        setStatus(text.includes('code: 0') ? 'success' : 'error');
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hasFiles && status !== 'idle') {
      setStatus('idle');
    }
  }, [hasFiles, status]);

  const handleConvert = () => {
    if (!hasFiles || status === 'running') {
      return;
    }

    const payload = files.map((item) => {
      const fileNameWithoutExtension = item.file.name
        .split('.')
        .filter((_, index, arr) => index < arr.length - 1)
        .join('.');

      return {
        inputPath: (item.file as FileWithPath).path ?? '',
        outputPath: item.file.path.replace(
          item.file.name,
          `${fileNameWithoutExtension}.${item.outputFormat}`,
        ),
      };
    });

    const hasMissingPath = payload.some((item) => !item.inputPath);
    if (hasMissingPath) {
      setStatus('error');
      setLogs(['Unable to start conversion: missing file path information.']);
      return;
    }

    setStatus('running');
    setLogs([]);

    window.electron?.ipcRenderer.sendMessage('ffmpeg', payload);
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        className="w-auto"
        onClick={handleConvert}
        disabled={disableConvert}
      >
        {status === 'running' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Converting…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            {summaryLabel}
          </>
        )}
      </Button>

      {status !== 'idle' && statusDetails.message && (
        <p className={`text-sm ${statusDetails.className}`}>
          {statusDetails.message}
        </p>
      )}

      {logs.length > 0 && (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
          {logs.join('\n')}
        </div>
      )}
    </div>
  );
}
