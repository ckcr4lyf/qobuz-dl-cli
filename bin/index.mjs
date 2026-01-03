#!/usr/bin/env node

import { QobuzDlAPI } from "../src/api.mjs";
import { getFormat } from "../src/args.mjs";
import { downloadAlbum, getLogger } from "../src/utils.mjs";

const logger = getLogger();

if (process.argv.length < 3){
  logger.warn(`Usage: qdc <album-id> (--format=alac)`);
  process.exit(-1);
}

// TBD: We should probably let the base url be configurable?!
const api = new QobuzDlAPI("https://qobuz.squid.wtf");
await downloadAlbum(process.argv[2], getFormat(process.argv), api);
