import './styles/global.css';
import { useCallback } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FileUpload } from './components/file-upload';
import { FileList } from './components/files/file-list';
import { FileConvert } from './components/file-convert';
import { ThemeProvider } from './components/theme-provider';
import { useFileStore } from './stores/file';

function Index() {
  const files = useFileStore((state) => state.files);
  const addFiles = useFileStore((state) => state.addFile);
  const removeFile = useFileStore((state) => state.removeFile);
  const updateFileOutputFormat = useFileStore(
    (state) => state.updateFileOutputFormat,
  );

  const handleFilesSelected = useCallback(
    (input: HTMLInputElement) => {
      const selected = window.electron?.ipcRenderer.getFilesPath(input) ?? [];
      addFiles(selected as File[]);
    },
    [addFiles],
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-4">
        <FileUpload onFilesSelected={handleFilesSelected} />
        {files.length > 0 && (
          <section className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Selected Files ({files.length})
            </p>
            <div className="max-h-48 overflow-y-auto">
              <FileList
                files={files}
                onRemoveFile={removeFile}
                onChangeOutputFormat={updateFileOutputFormat}
              />
            </div>
            <FileConvert />
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
