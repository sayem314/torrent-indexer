import type {
  SearchType,
  SourcesConfig,
  TorrentIndexerOptions,
  TorrentResult
} from "./types.js";
import type LeetxSearch from "./sources/1337x.js";
import type EztvSearch from "./sources/eztv.js";
import type KickassSearch from "./sources/kickass.js";
import type LimetorrentsSearch from "./sources/limetorrents.js";
import type RarbgSearch from "./sources/rarbg.js";
import type SkySearch from "./sources/skytorrents.js";
import type ThePirateBaySearch from "./sources/thepiratebay.js";
import type TorrentProjectSearch from "./sources/torrentproject.js";
import type YtsSearch from "./sources/yts.js";
import type ZooqleSearch from "./sources/zooqle.js";

export default class TorrentIndexer {
  sources: SourcesConfig;
  YTS: YtsSearch;
  LEETX: LeetxSearch;
  KICKASS: KickassSearch;
  EZTV: EztvSearch;
  RARBG: RarbgSearch;
  SKY: SkySearch;
  ZOOQLE: ZooqleSearch;
  TPB: ThePirateBaySearch;
  LIMETORRENTS: LimetorrentsSearch;
  TORRENTPROJECT: TorrentProjectSearch;

  constructor(config?: TorrentIndexerOptions);
  search(query: string, type?: SearchType | null, page?: number): Promise<TorrentResult[]>;
  torrentFromString(data: string): string;
  torrent(url: string): Promise<string>;
}
