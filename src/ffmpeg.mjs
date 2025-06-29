import { rejects } from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';

/**
 * 
 * @param {import('./types').TrackDetails} trackDetails 
 */
export const muxToDisk = async (trackDetails) => {
  return new Promise((resolve, reject) => {
    const { coverArt, flac, format, metadata, albumFolder, trackName, trackNumber } = trackDetails;

    const extension = format === 'FLAC' ? 'flac' : 'm4a';
    const encodedFilename = path.join(albumFolder, `${trackNumber.toString().padStart(2, '0')} - ${trackName}.${extension}`);
    const ffmpegCodec = format === 'FLAC' ? 'copy' : 'alac';

    const alac = spawn('ffmpeg', ['-y', '-i', flac, '-i', metadata, '-i', coverArt, '-map_metadata', '1', '-c:v', 'copy', '-disposition:v', 'attached_pic', '-c:a', ffmpegCodec, encodedFilename]);

    alac.on('error', (e) => {
      console.error(e);
      reject(e);
    })

    alac.on('close', () => {
      resolve(encodedFilename);
    })
  })
}