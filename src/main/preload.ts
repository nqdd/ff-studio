// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  webUtils,
} from 'electron';

export type Channels = 'ping' | 'log' | 'ffmpeg' | 'upload-file';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    /**
     * get file path for uploaded file.
     *
     * ref: https://github.com/electron/electron/issues/45665#issuecomment-2664449366
     * @param input HTMLInputElement
     * @returns list of file with path
     * we need to pass the input element to get the file path because we can't loop through the FileList
     */
    getFilesPath(input: HTMLInputElement) {
      return Array.from(input?.files ?? []).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        path: webUtils.getPathForFile(file),
      }));
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
