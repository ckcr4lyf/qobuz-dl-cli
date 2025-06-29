import os from 'node:os';
import fs from 'node:fs';
import { Logger, LOGLEVEL } from '@ckcr4lyf/logger'

import { QobuzDlAPI } from "./api.mjs"
import { encodeToAlac } from './ffmpeg.mjs';
import path from 'node:path';

export const getLogger = () => {
    return new Logger({ loglevel: LOGLEVEL.INFO });
}

/**
 * 27 -> FLAC 24bit 192kHZ
 * 7 -> FLAC 24bit 96kHz
 * 6 -> FLAC 16bit 44.1kHZ
 * 5 -> MP3 320kbps
 */
const QUALITY = 6;

/**
 * 
 * @param {string} albumId 
 * @param {QobuzDlAPI} api 
 */
export const downloadAlbum = async (albumId, api) => {
    const logger = getLogger();

    logger.info(`Going to get album info from Qobuz-DL instance (Album ID: ${albumId})`);
    const albumInfo = await api.getAlbumInfo(albumId);

    logger.info(`Going to download album art from Qobuz`);
    const albumArt = await api.downloadAlbumArt(albumInfo);

    const albumArtFilename = getTempFolderFilename(`${albumId}_cover.jpg`);
    fs.writeFileSync(albumArtFilename, Buffer.from(albumArt));
    logger.info(`Wrote album art to ${albumArtFilename}`);

    const albumFolder = createAlbumDirectory(albumInfo);

    logger.info(`going to download tracks in parallel...`)
    const trackPromises = await Promise.all(albumInfo.data.tracks.items.map(track => downloadTrack(albumInfo, albumArtFilename, albumFolder, track, api)));

    logger.info(`we cooked!`);
}

/**
 * 
 * @param {import('./api').Track} track 
 * @param {QobuzDlAPI} api 
 */
export const downloadTrack = async(albumInfo, albumArtFilename, albumFolder, track, api) => {
    const logger = getLogger();
    logger.info(`[${track.id}] Going to get download URL for track #${track.track_number} (${track.title})`);
    const trackDownloadUrl = await api.getTrackDownloadLink(track.id, QUALITY);
    
    logger.info(`[${track.id}] Downloading track...`);
    const trackResponse = await fetch(trackDownloadUrl.data.url);
    const trackData = await trackResponse.arrayBuffer();
    const trackFilename = getTempFolderFilename(`${track.id}_${QUALITY}.flac`);
    fs.writeFileSync(trackFilename, Buffer.from(trackData));
    logger.info(`[${track.id}] Downloaded file to ${trackFilename}`);

    const metadataFilename = getTempFolderFilename(`${track.id}.txt`);
    const metadata = generateFfmpegMetadata(albumInfo, track);
    fs.writeFileSync(metadataFilename, metadata)
    logger.info(`[${track.id}] Wrote metadata to ${metadataFilename}`);

    await encodeToAlac({
        coverArt: albumArtFilename,
        flac: trackFilename,
        metadata: metadataFilename,
        trackName: track.title,
        trackNumber: track.track_number,
        albumFolder: albumFolder,
    });

    logger.info(`[${track.id}] encoded to ALAC`);
}

/**
 * 
 * @param {import('./api').AlbumInfo} albumInfo 
 * @param {import('./api').Track} trackInfo 
 */
export const generateFfmpegMetadata = (albumInfo, trackInfo) => {
    let metadata = `;FFMETADATA1`
    metadata += `\ntitle=${trackInfo.title}`;

    if (albumInfo.data.artists.length > 0) {
        metadata += `\nartist=${trackInfo.performer.name}`;
        metadata += `\nalbum_artist=${albumInfo.data.artist.name}`
    } else {
        metadata += `\nartist=Various Artists`;
        metadata += `\nalbum_artist=Various Artists`;
    }

    metadata += `\nalbum=${albumInfo.data.title}`
    metadata += `\ndate=${albumInfo.data.release_date_original}`
    metadata += `\nyear=${new Date(albumInfo.data.release_date_original).getFullYear()}`
    metadata += `\nlabel=${albumInfo.data.label.name}`
    metadata += `\ncopyright=${albumInfo.data.copyright}`
    if (trackInfo.isrc) metadata += `\nisrc=${trackInfo.isrc}`;
    if (albumInfo.data.upc) metadata += `\nbarcode=${albumInfo.data.upc}`;
    if (trackInfo.track_number) metadata += `\ntrack=${trackInfo.track_number}`;

    return metadata;
}

/**
 * 
 * @param {import('./api').AlbumInfo} albumInfo 
 * @returns {string} The path to the created directory
 */
export const createAlbumDirectory = (albumInfo) => {
    const artistName = albumInfo.data.artist.name;
    const albumName = albumInfo.data.title;
    const dirName = `${artistName} - ${albumName}`;
    
    // Remove invalid characters for directory names
    const sanitizedDirName = path.join(process.cwd(), dirName.replace(/[<>:"/\\|?*]/g, ''));
    
    if (!fs.existsSync(sanitizedDirName)) {
        fs.mkdirSync(sanitizedDirName, { recursive: true });
    }
    
    return sanitizedDirName;
}


export const getTempFolderFilename = (filename) => {
    return path.join(os.tmpdir(), filename);
}