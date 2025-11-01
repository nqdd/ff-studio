import { ipcMain } from 'electron';
import { ffmpegCommand } from './ffmpeg';

ipcMain.on('ping', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC ping: ${pingPong}`;
  console.debug(msgTemplate(arg));
  event.reply('ping', msgTemplate('pong'));
});

ipcMain.on('ffmpeg', async (event) => {
  ffmpegCommand('', '', event);
});
