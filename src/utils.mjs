import fs from 'node:fs';
import { Logger, LOGLEVEL } from '@ckcr4lyf/logger'

import { QobuzDlAPI } from "./api.mjs"

export const getLogger = () => {
    return new Logger({ loglevel: LOGLEVEL.INFO });
}

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

    const albumArtFilename = `${albumId}_cover.jpg`
    fs.writeFileSync(albumArtFilename, Buffer.from(albumArt));
    logger.info(`Wrote album art to ${albumArtFilename}`);

    for (const track of albumInfo.data.tracks.items){
        logger.info(`Going to get download URL for track #${track.track_number} (${track.title})`);
        const trackDownloadUrl = await api.getTrackDownloadLink(track.id, 27);
        
        logger.info(`Downloading track...`);
        const trackResponse = await fetch(trackDownloadUrl.data.url);
        const trackData = await trackResponse.arrayBuffer();
        const trackFilename = `${track.id}.flac`;
        fs.writeFileSync(trackFilename, Buffer.from(trackData));
        logger.info(`Downloaded file to ${trackFilename}`);

        const metadataFilename = `${track.id}.txt`;
        const metadata = generateFfmpegMetadata(albumInfo, track);
        fs.writeFileSync(metadataFilename, metadata)
        logger.info(`Wrote metadata to ${metadataFilename}`);
        break;
    }
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
