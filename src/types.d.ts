export type TrackDetails = {
  trackNumber: number;
  trackName: string;
  coverArt: string;
  flac: string;
  metadata: string;
  albumFolder: string;
  /**
   * FLAC: just mux w/ metadata, album art
   * ALAC: change container to m4a, add metadata, album art (iPod compatibility)
   */
  format: 'FLAC' | 'ALAC',
}