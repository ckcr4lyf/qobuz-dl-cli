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
}