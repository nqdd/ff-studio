import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RequireOnly } from '../lib/types';

export const IMAGE_OUTPUT_FORMATS = ['png', 'jpeg', 'webp', 'gif'] as const;
export const VIDEO_OUTPUT_FORMATS = ['mp4', 'mov', 'webm'] as const;

export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number];
export type VideoOutputFormat = (typeof VIDEO_OUTPUT_FORMATS)[number];
export type OutputFormat = ImageOutputFormat | VideoOutputFormat;

export type ConversionStatus = 'idle' | 'running' | 'success' | 'error';

export type ConversionFile = {
  name: string;
  size: number;
  type: string;
  path: string;
  lastModified: number;
  outputFormat: OutputFormat;
  status: ConversionStatus;
};

export type FileStore = {
  files: ConversionFile[];
  addFiles: (files: Omit<ConversionFile, 'outputFormat' | 'status'>[]) => void;
  removeFile: (file: ConversionFile) => void;
  updateFileOutputFormat: (
    file: ConversionFile,
    outputFormat: OutputFormat,
  ) => void;
  bulkUpdateFiles: (files: ConversionFile[]) => void;
  updateFile: (file: RequireOnly<ConversionFile, 'path'>) => void;
  clearFiles: () => void;
};

const getDefaultOutputFormat = (fileType: string): OutputFormat =>
  fileType.startsWith('video/') ? 'mp4' : 'png';

export const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      files: [],
      addFiles: (newFiles) =>
        set((state): Partial<FileStore> => {
          const fileMap = state.files.reduce((map, file) => {
            map.set(file.path, file);
            return map;
          }, new Map<string, ConversionFile>());
          for (const newFile of newFiles) {
            const existingFile = fileMap.get(newFile.path);
            if (!existingFile) {
              fileMap.set(newFile.path, {
                ...newFile,
                outputFormat: getDefaultOutputFormat(newFile.type),
                status: 'idle',
              });
            } else {
              fileMap.set(newFile.path, {
                ...existingFile,
                ...newFile,
              });
            }
          }

          return {
            files: Array.from(fileMap.values()),
          };
        }),
      removeFile: (file: ConversionFile) =>
        set((state) => ({
          files: state.files.filter(
            (conversionFile) => conversionFile.path !== file.path,
          ),
        })),
      updateFile: (updatedFile: RequireOnly<ConversionFile, 'path'>) =>
        set((state) => {
          const fileMap = state.files.reduce((map, file) => {
            map.set(file.path, file);
            return map;
          }, new Map<string, ConversionFile>());
          const existingFile = fileMap.get(updatedFile.path);
          if (existingFile) {
            fileMap.set(updatedFile.path, {
              ...existingFile,
              ...updatedFile,
            });
          }
          return {
            files: Array.from(fileMap.values()),
          };
        }),
      bulkUpdateFiles: (updatedFiles: ConversionFile[]) =>
        set((state) => {
          const fileMap = state.files.reduce((map, file) => {
            map.set(file.path, file);
            return map;
          }, new Map<string, ConversionFile>());
          for (const updatedFile of updatedFiles) {
            const existingFile = fileMap.get(updatedFile.path);
            if (fileMap.has(updatedFile.path)) {
              fileMap.set(updatedFile.path, {
                ...existingFile,
                ...updatedFile,
              });
            }
          }
          return {
            files: Array.from(fileMap.values()),
          };
        }),
      updateFileOutputFormat: (
        file: ConversionFile,
        outputFormat: OutputFormat,
      ) =>
        set((state) => ({
          files: state.files.map((conversionFile) =>
            conversionFile.path === file.path
              ? { ...conversionFile, outputFormat }
              : conversionFile,
          ),
        })),

      clearFiles: () => set({ files: [] }),
    }),
    {
      name: 'file-store', // storage key
      // ⚠️ Note: File objects cannot be serialized, so they will not survive reloads.
      // Only metadata like outputFormat can persist.
      partialize: (state) => ({
        // You could persist file metadata only (e.g. names)
        files: state.files.map((f) => ({
          outputFormat: f.outputFormat,
          name: f.name,
          type: f.type,
          path: f.path,
          size: f.size,
          lastModified: f.lastModified,
        })),
      }),
    },
  ),
);
