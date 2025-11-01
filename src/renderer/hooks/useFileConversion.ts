import { useCallback } from 'react';
import { ConversionFile } from '../stores/file';
import { useIpcRenderer } from './useIpcRenderer';

export const useFileConversion = () => {
  const ipcRenderer = useIpcRenderer();

  const convertFiles = useCallback(
    (files: ConversionFile[]) => {
      const payload = files.map((item) => {
        const fileNameWithoutExtension = item.name
          .split('.')
          .filter((_, index, arr) => index < arr.length - 1)
          .join('.');

        return {
          inputPath: item.path ?? '',
          outputPath: item.path.replace(
            item.name,
            `${fileNameWithoutExtension}.${item.outputFormat}`,
          ),
        };
      });

      ipcRenderer.sendMessage('ffmpeg', payload);
    },
    [ipcRenderer],
  );

  return {
    convertFiles,
  };
};
