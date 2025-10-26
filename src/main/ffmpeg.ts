import ffmpeg from '@ffmpeg-installer/ffmpeg';

export const ffmpegCommand = async (input: string, output: string) => {
  const { spawn } = await import('child_process');
  console.debug('ffmpeg path:', ffmpeg.path);
  console.debug('ffmpeg version:', ffmpeg.version);

  return new Promise<void>((resolve, reject) => {
    const ffmpegProcess = spawn(
      ffmpeg.path,
      input && output ? ['-i', input, output] : [],
    );

    ffmpegProcess.stdout.on('data', (data) => {
      console.debug(`[ffmpeg stdout]: ${data.toString().trim()}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.debug(`[ffmpeg stderr]: ${data.toString().trim()}`);
    });

    ffmpegProcess.on('error', (err) => {
      reject(new Error(`FFmpeg process error: ${err.message}`));
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.debug('✅ FFmpeg finished successfully.');
        resolve();
      } else {
        reject(new Error(`❌ FFmpeg exited with code ${code}`));
      }
    });
  });
};
