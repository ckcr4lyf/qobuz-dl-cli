export const getFormat = () => {
    const formatFlag = process.argv.find(arg => arg.startsWith('--format='));
    if (formatFlag && formatFlag.includes('m4a')) {
        return 'M4A';
    }
    return 'FLAC';
}
