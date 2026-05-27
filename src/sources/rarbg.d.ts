import TorrentSource from "../lib/torrentSource.js";
import type { SearchType, SourceOptions, TorrentResult } from "../types.js";

export default class Rarbg extends TorrentSource {
  url: string;

  constructor(options: SourceOptions);
  search(
    query: string,
    type?: SearchType | null,
    page?: number,
    category?: string
  ): Promise<TorrentResult[]>;
}
