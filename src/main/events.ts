import { ipcMain } from 'electron';
import { ffmpegCommand } from './ffmpeg';

ipcMain.on('ping', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC ping: ${pingPong}`;
  console.debug(msgTemplate(arg));
  event.reply('ping', msgTemplate('pong'));
});

ipcMain.on('ffmpeg', async (event, payload) => {
  const tasks = [];
  for (const item of payload) {
    console.debug(`converting file ${item.inputPath} to ${item.outputPath}`);
    tasks.push(
      ffmpegCommand(item.inputPath, item.outputPath, event)
        .then((success) => {
          if (success) {
            console.debug(`File ${item.inputPath} converted successfully`);
          } else {
            console.error(`Failed to convert file ${item.inputPath}`);
          }
          event.sender.send('ffmpeg::convert-result', {
            success: false,
            filePath: item.inputPath,
          });
          return success;
        })
        .catch((error) => {
          console.error(`Failed to convert file ${item.inputPath}: ${error}`);
          event.sender.send('ffmpeg::convert-result', {
            success: false,
            error: error.message,
            filePath: item.inputPath,
          });
          return false;
        }),
    );
  }
  await Promise.allSettled(tasks);
});
