import { QobuzDlAPI } from "../src/api.mjs";
import { downloadAlbum, getLogger } from "../src/utils.mjs";

console.log(process.argv);
const logger = getLogger();

if (process.argv.length < 3){
  logger.warn(`Usage: qdc <album-id>`);
}

// TBD: We should probably let the base url be configurable?!
const api = new QobuzDlAPI("https://us.qobuz.squid.wtf");
await downloadAlbum(process.argv[2], api);
