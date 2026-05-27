import TorrentSource from "../lib/torrentSource.js";
import type { SearchType, SourceOptions, TorrentResult } from "../types.js";

export default class Kickass extends TorrentSource {
  url: string;

  constructor(options: SourceOptions);
  search(query: string, type?: SearchType | null, page?: number): Promise<TorrentResult[]>;
}
