/**
 * API to interact w/ Qobuz-DL
 */

export class QobuzDlAPI {
    /**
     * 
     * @param {string} apiBase The base path to the qobuz-dl instance (example: https://us.qobuz.squid.wtf)
     */
    constructor(apiBase){
        this.apiBase = apiBase;
    }

    async getAlbumInfo(albumId){
        const response = await fetch(`${this.apiBase}/api/get-album?album_id=${albumId}`);
        return response.json();
    }

    /**
     * 
     * @param {string} trackId 
     * @param {string} quality FLAC=27
     */
    async getTrackDownloadLink(trackId, quality){
        const response = await fetch(`${this.apiBase}/api/download-music?track_id=${trackId}&quality=${quality}`)
        return response.json();
    }

    /**
     * 
     * @param {any} albumInfo 
     * @returns ArrayBuffer
     */
    async downloadAlbumArt(albumInfo){
        const imageUrl = albumInfo.data.image.large;
        const response = await fetch(imageUrl);
        return response.arrayBuffer();
    }
}