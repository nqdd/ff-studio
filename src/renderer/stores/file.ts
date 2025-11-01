import { create } from 'zustand';

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
  addFile: (file: File[]) => void;
  removeFile: (file: File) => void;
  updateFileOutputFormat: (file: File, outputFormat: OutputFormat) => void;
};

const getDefaultOutputFormat = (file: File): OutputFormat =>
  file.type.startsWith('video/') ? 'mp4' : 'png';

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file: File[]) =>
    set((state) => ({
      files: [
        ...state.files,
        ...file.map((item) => ({
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
          ? {
              ...storedFile,
              outputFormat,
            }
          : storedFile,
      ),
    })),
}));
