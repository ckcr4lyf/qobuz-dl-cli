import { rejects } from 'node:assert';
import { spawn, spawnSync } from 'node:child_process';

/**
 * 
 * @param {import('./types').TrackDetails} trackDetails 
 */
export const encodeToAlac = async (trackDetails) => {
  return new Promise((resolve, reject) => {
    const { coverArt, flac, metadata, trackName, trackNumber } = trackDetails;
    const alac = spawn('ffmpeg', ['-y', '-i', flac, '-i', metadata, '-i', coverArt, '-map_metadata', '1', '-c:v', 'copy', '-disposition:v', 'attached_pic', '-c:a', 'alac', `${trackNumber.toString().padStart(2, '0')} - ${trackName}.m4a`]);

    alac.on('error', (e) => {
      console.error(e);
      reject(e);
    })

    alac.on('close', () => {
      resolve();
    })
  })
}