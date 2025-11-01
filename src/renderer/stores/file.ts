import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const IMAGE_OUTPUT_FORMATS = ['png', 'jpeg', 'webp', 'gif'] as const;
export const VIDEO_OUTPUT_FORMATS = ['mp4', 'mov', 'webm'] as const;

export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number];
export type VideoOutputFormat = (typeof VIDEO_OUTPUT_FORMATS)[number];
export type OutputFormat = ImageOutputFormat | VideoOutputFormat;

export type StoredFile = {
  file: File;
  outputFormat: OutputFormat;
};

export type FileStore = {
  files: StoredFile[];
  addFile: (files: File[]) => void;
  removeFile: (file: File) => void;
  updateFileOutputFormat: (file: File, outputFormat: OutputFormat) => void;
  clearFiles: () => void;
};

const getDefaultOutputFormat = (file: File): OutputFormat =>
  file.type.startsWith('video/') ? 'mp4' : 'png';

export const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      files: [],
      addFile: (files: File[]) =>
        set((state) => ({
          files: [
            ...state.files,
            ...files.map((item) => ({
              file: item,
              outputFormat: getDefaultOutputFormat(item),
            })),
          ],
        })),
      removeFile: (file: File) =>
        set((state) => ({
          files: state.files.filter((storedFile) => storedFile.file !== file),
        })),
      updateFileOutputFormat: (file: File, outputFormat: OutputFormat) =>
        set((state) => ({
          files: state.files.map((storedFile) =>
            storedFile.file === file
              ? { ...storedFile, outputFormat }
              : storedFile,
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
          file: {
            name: f.file.name,
            type: f.file.type,
            path: f.file.path,
            size: f.file.size,
            lastModified: f.file.lastModified,
          },
        })),
      }),
    },
  ),
);
