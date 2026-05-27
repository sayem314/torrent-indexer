export type SearchType =
  | "movie"
  | "movies"
  | "tv"
  | "series"
  | "anime"
  | "music"
  | (string & {});

export interface SourceOptions {
  name: string;
  url: string;
  [key: string]: unknown;
}

export interface SourcesConfig {
  kickass: SourceOptions;
  limetorrents: SourceOptions;
  yts: SourceOptions;
  tpb: SourceOptions;
  sky: SourceOptions;
  leetx: SourceOptions;
  nyaa: SourceOptions;
  tokyotosho: SourceOptions;
  eztv: SourceOptions;
  rarbg: SourceOptions;
  zooqle: SourceOptions;
  xbit: SourceOptions;
  torrentproject: SourceOptions;
  torrentz2: SourceOptions;
  [key: string]: SourceOptions;
}

export interface TorrentIndexerOptions {
  sources?: Partial<SourcesConfig>;
}

export interface TorrentInput {
  fileName: string;
  seeders: number;
  leechers?: number;
  uploaded?: string;
  uploader?: string;
  size?: string;
  length?: number;
  link?: string;
  site?: string;
  category?: string;
  verified?: boolean;
  [key: string]: unknown;
}

export interface TorrentResult extends TorrentInput {
  leechers: number;
  sourceName?: string;
  score?: number;
  title?: string;
  resolution?: string;
  source?: string;
  codec?: string;
  group?: string;
  season?: number;
  episode?: number;
  year?: number;
  language?: string;
}

export interface ParsedTorrent {
  title?: string;
  episode?: number;
  season?: number;
  score?: number;
  [key: string]: unknown;
}
