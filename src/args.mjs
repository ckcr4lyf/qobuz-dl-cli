export const getFormat = (argv) => {
    const formatFlag = argv.find(arg => arg.startsWith('--format='));
    if (formatFlag && formatFlag.includes('alac')) {
        return 'ALAC';
    }
    return 'FLAC';
}
