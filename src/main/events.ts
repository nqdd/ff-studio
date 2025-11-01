import { ipcMain } from 'electron';
import { ffmpegCommand } from './ffmpeg';

ipcMain.on('ping', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC ping: ${pingPong}`;
  console.debug(msgTemplate(arg));
  event.reply('ping', msgTemplate('pong'));
});

ipcMain.on('ffmpeg', async (event, payload) => {
  console.debug({ event, payload });
  for (const item of payload) {
    console.debug(`converting file ${item.inputPath} to ${item.outputPath}`);
    ffmpegCommand(item.inputPath, item.outputPath, event);
  }
});
