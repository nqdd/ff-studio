import { useEffect, useState, useRef } from 'react';
import { useIpcRenderer } from '../hooks/useIpcRenderer';

const MAX_LOGS = 1000;

export function FileConversionLog() {
  const ipcRenderer = useIpcRenderer();
  const logPanelRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = ipcRenderer.on('ffmpeg::log', (message) => {
      const text = String(message);
      setLogs((prev) => {
        const newLogs = [text, ...prev];
        return newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [ipcRenderer]);

  useEffect(() => {
    if (logPanelRef.current) {
      logPanelRef.current.scrollTop = logPanelRef.current.scrollHeight;
    }
  }, [logs]);

  if (!logs.length) {
    return null;
  }

  return (
    <div
      ref={logPanelRef}
      className="max-h-64 overflow-y-auto rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground whitespace-pre-wrap"
    >
      {logs.join('\n')}
    </div>
  );
}
