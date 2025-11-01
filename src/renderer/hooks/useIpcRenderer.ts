import { useRef } from 'react';

export const useIpcRenderer = () => {
  const ipcRenderer = useRef(window?.electron.ipcRenderer);
  return ipcRenderer.current;
};
