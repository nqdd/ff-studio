import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { IpcMainEvent } from 'electron';

export const ffmpegCommand = async (
  input: string,
  output: string,
  event?: IpcMainEvent,
) => {
  const { spawn } = await import('child_process');
  // ref: https://github.com/electron/packager/issues/740
  const ffmpegPath = ffmpeg.path.replace('app.asar', 'app.asar.unpacked');
  const ffmpegVersion = ffmpeg.version;
  console.debug('ffmpeg path:', ffmpegPath);
  console.debug('ffmpeg version:', ffmpegVersion);

  return new Promise<boolean>((resolve, reject) => {
    const ffmpegProcess = spawn(
      ffmpegPath,
      input && output ? ['-y', '-i', input, output] : ['-y'],
    );

    const ffmpegLogChannel = 'ffmpeg::log';

    ffmpegProcess.stdout.on('data', (data) => {
      const msg = `[ffmpeg stdout]: ${data.toString().trim()}`;
      console.debug(msg);
      if (event) {
        event.reply(ffmpegLogChannel, msg);
      }
    });

    ffmpegProcess.stderr.on('data', (data) => {
      const msg = `[ffmpeg stderr]: ${data.toString().trim()}`;
      console.debug(msg);
      if (event) {
        event.reply(ffmpegLogChannel, msg);
      }
    });

    ffmpegProcess.on('error', (err) => {
      const msg = `[ffmpeg error] FFmpeg process error: ${err.message}`;
      console.debug(msg);
      if (event) {
        event.reply(ffmpegLogChannel, msg);
      }
      reject(new Error(msg));
    });

    ffmpegProcess.on('close', (code) => {
      console.debug('FFmpeg process exited with code: ', code);
      event?.reply(
        ffmpegLogChannel,
        `FFmpeg process exited with code: ${code}`,
      );
      if (code === 0) {
        console.debug('✅ FFmpeg finished successfully.');
        resolve(true);
      } else {
        reject(
          new Error(`❌ FFmpeg exited with code ${code}, ${input}, ${output}`),
        );
      }
    });
  });
};
