import TorrentSource from "../lib/torrentSource.js";
import type { SourceOptions, TorrentResult } from "../types.js";

export default class Torrentz2 extends TorrentSource {
  url: string;

  constructor(options: SourceOptions);
  search(): Promise<TorrentResult[]>;
}
