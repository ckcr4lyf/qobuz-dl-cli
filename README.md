# qobuz-dl-cli

CLI wrapper around [Qobuz-DL](https://github.com/QobuzDL/Qobuz-DL) instances to get around browser RAM / zipping etc. limitations

Currently limited to downloading albums in 16bit 44.1kHZ FLAC / ALAC.

## Installation & Usage

You must have Node.JS v22+, and ffmpeg installed and available in the PATH.

Installation:
```
npm i qobuz-dl-cli
```

Usage:
```
qdc <album-id> (--format=alac)
```

Examples 

* download as ALAC in `m4a` container for iPod):
```
qdc wq566r6h4kfeb --format=alac
```

* download as FLAC
```
qdc wq566r6h4kfeb
```

## How it works
This program uses the API offered by Qobuz-DL to get album information and signed URLs. It then downloads album art & the raw audio (FLAC) from Qobuz, and uses ffmpeg to mux in the metadata and artwork.
