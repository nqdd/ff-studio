import { createRoot } from 'react-dom/client';
import App from './main';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

window.electron?.ipcRenderer.once('ping', (data) => {
  console.debug(data);
});
window.electron?.ipcRenderer.on('ffmpeg::log', console.debug);

window.electron?.ipcRenderer.sendMessage('ping', ['ping']);
window.electron?.ipcRenderer.sendMessage('ffmpeg');
