import type {
  ParsedTorrent,
  SearchType,
  TorrentInput,
  TorrentResult
} from "../types.js";

export default class TorrentSource {
  sourceName: string;

  constructor(sourceName: string);
  reconstitute(
    results: TorrentInput[],
    query: string,
    type?: SearchType | null
  ): TorrentResult[];
  isTorrentOfType(torrent: ParsedTorrent, type?: SearchType | null): boolean;
}
