import fs from 'node:fs';

import { QobuzDlAPI } from "./api.mjs"

/**
 * 
 * @param {string} albumId 
 * @param {QobuzDlAPI} api 
 */
export const downloadAlbum = async (albumId, api) => {
    const albumInfo = await api.getAlbumInfo(albumId);
    const albumArt = await api.downloadAlbumArt(albumInfo);
    fs.writeFileSync(`${albumId}_cover.jpg`, Buffer.from(albumArt));
}