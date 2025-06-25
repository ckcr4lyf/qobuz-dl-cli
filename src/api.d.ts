export type Track = {
    copyright: string;
    isrc: string;
    title: string;
    track_number: number;
    id: number;
    performer: {
        name: string;
    }
}

export type AlbumInfo = {
    data: {
        image: {
            large: string;
        },
        artist: {
            name: string;
            id: number;
        },
        label: {
            name: string;
        },
        upc: string;
        title: string;
        id: string;
        release_date_original: string; // YYYY-MM-DD
        hires: boolean;
        copyright: string;
        tracks: {
            total: number;
            items: Track[];
        }
    }
}

export type TrackDownloadInfo = {
    data: {
        url: string;
    },
    success: boolean;
}
