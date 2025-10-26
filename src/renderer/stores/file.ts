import { create } from 'zustand';

export type FileStore = {
  files: File[];
  addFile: (file: File[]) => void;
  removeFile: (file: File) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFile: (file: File[]) =>
    set((state) => ({ files: [...state.files, ...file] })),
  removeFile: (file: File) =>
    set((state) => ({ files: state.files.filter((f) => f !== file) })),
}));
