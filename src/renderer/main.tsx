import './styles/global.css';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FileUpload } from './components/file-upload';
import { FileList } from './components/files/file-list';
import { ThemeProvider } from './components/theme-provider';
import { useFileStore } from './stores/file';
import { Button } from './components/ui/button';
import { useIpcRenderer } from './hooks/useIpcRenderer';
import { useFileConversion } from './hooks/useFileConversion';

function Index() {
  const ipcRenderer = useIpcRenderer();
  const files = useFileStore((state) => state.files);
  const addFiles = useFileStore((state) => state.addFiles);
  const bulkUpdateFiles = useFileStore((state) => state.bulkUpdateFiles);
  const updateFile = useFileStore((state) => state.updateFile);
  const removeFile = useFileStore((state) => state.removeFile);
  const clearFiles = useFileStore((state) => state.clearFiles);
  const updateFileOutputFormat = useFileStore(
    (state) => state.updateFileOutputFormat,
  );
  const { convertFiles } = useFileConversion();

  const hasAllFileConverted = useMemo(() => {
    return files.every((file) => file.status === 'success');
  }, [files]);

  const isRunning = useMemo(() => {
    return files.some((file) => file.status === 'running');
  }, [files]);

  const handleFilesSelected = useCallback(
    (input: HTMLInputElement) => {
      const selected = window.electron?.ipcRenderer.getFilesPath(input) ?? [];
      addFiles(selected);
    },
    [addFiles],
  );

  const handleConvertFiles = useCallback(() => {
    bulkUpdateFiles(files.map((file) => ({ ...file, status: 'running' })));
    convertFiles(files);
  }, [files, bulkUpdateFiles, convertFiles]);

  useEffect(() => {
    console.debug('listening for ffmpeg::convert-result');
    const unsubscribe = ipcRenderer.on('ffmpeg::convert-result', (result) => {
      console.debug('ffmpeg::convert-result', result);
      const { filePath, success } = (result ?? {}) as {
        filePath: string;
        success: boolean;
        error: string;
      };
      if (filePath)
        updateFile({ path: filePath, status: success ? 'success' : 'error' });
    });

    return () => {
      unsubscribe?.();
    };
  }, [ipcRenderer, updateFile]);

  const actionButton = useMemo(() => {
    if (!files.length) {
      return null;
    }

    if (hasAllFileConverted) {
      return (
        <Button
          variant="outline"
          type="button"
          className="w-auto"
          onClick={clearFiles}
        >
          <span>Done</span>
        </Button>
      );
    }

    if (isRunning) {
      return (
        <div className="flex justify-end">
          <Button variant="outline" type="button" className="w-auto">
            <span>Converting...</span>
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        type="button"
        className="w-auto"
        onClick={handleConvertFiles}
      >
        <RefreshCw />
        {`Convert ${files.length} file${files.length > 1 ? 's' : ''}`}
      </Button>
    );
  }, [files, isRunning, hasAllFileConverted, handleConvertFiles, clearFiles]);

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-4">
        <h1 className="text-center text-4xl">Media Converter</h1>
        <h2 className="text-center text-gray-400">Convert images and videos</h2>
        <FileUpload onFilesSelected={handleFilesSelected} />
        {files.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-foreground">
                Selected Files ({files.length})
              </p>
              {!hasAllFileConverted && (
                <Button
                  variant="ghost"
                  onClick={clearFiles}
                  disabled={isRunning}
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="overflow-y-auto">
              <FileList
                files={files}
                onRemoveFile={removeFile}
                onChangeOutputFormat={updateFileOutputFormat}
              />
            </div>
            <div className="flex justify-end">{actionButton}</div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
