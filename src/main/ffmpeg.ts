import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { IpcMainEvent } from 'electron';

export const ffmpegCommand = async (
  input: string,
  output: string,
  event?: IpcMainEvent,
) => {
  const { spawn } = await import('child_process');
  console.debug('ffmpeg path:', ffmpeg.path);
  console.debug('ffmpeg version:', ffmpeg.version);

  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(
      ffmpeg.path,
      input && output ? ['-y', '-i', input, output] : ['-y'],
    );

    ffmpegProcess.stdout.on('data', (data) => {
      const msg = `[ffmpeg stdout]: ${data.toString().trim()}`;
      console.debug(msg);
      if (event) {
        event.reply('log', msg);
      }
    });

    ffmpegProcess.stderr.on('data', (data) => {
      const msg = `[ffmpeg stderr]: ${data.toString().trim()}`;
      console.debug(msg);
      if (event) {
        event.reply('log', msg);
      }
    });

    ffmpegProcess.on('error', (err) => {
      const msg = `[ffmpeg error] FFmpeg process error: ${err.message}`;
      console.debug(msg);
      if (event) {
        event.reply('log', msg);
      }
      reject(new Error(msg));
    });

    ffmpegProcess.on('close', (code) => {
      console.debug('FFmpeg process exited with code: ', code);
      event?.reply('log', `FFmpeg process exited with code: ${code}`);
      if (code === 0) {
        console.debug('✅ FFmpeg finished successfully.');
        resolve();
      } else {
        reject(new Error(`❌ FFmpeg exited with code ${code}`));
      }
    });
  });
};
