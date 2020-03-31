## torrent-indexer [![Build Status](https://travis-ci.org/sayem314/torrent-indexer.svg?branch=master)](https://travis-ci.org/sayem314/torrent-indexer) [![npm downloads per month](https://img.shields.io/npm/dm/torrent-indexer.svg)](https://www.npmjs.com/package/torrent-indexer) [![npm version](https://img.shields.io/npm/v/torrent-indexer?label=version)](https://www.npmjs.com/package/torrent-indexer)

Finds the best torrents (Movies, Series and Other stuff) across multiple sources.

### Installation

```bash
$ yarn add torrent-indexer
```

### Usage

Here's a simple example to search for torrents.

```js
const TorrentIndexer = require("torrent-indexer");
const torrentIndexer = new TorrentIndexer();

await torrentIndexer.search("rick and morty s04e04");
```

### API

```js
search(query, String(type);
```

| Parameters | Required |               Accepted Values |
| ---------- | :------: | ----------------------------: |
| type       |    No    | movie, series, music or anime |

Search method returns array of items:

| Property     |   Type   |           Optional |                                                                                                                                        Description |
| ------------ | :------: | -----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------: |
| `fileName`   | `string` |                :x: |                                                                                  torrent name found in the sites, might be stripped for some sites |
| `seeders`    | `number` |                :x: |                                                                                                                                      total seeders |
| `leechers`   | `number` |                :x: |                                                                                                                        total leechers (0 for eztv) |
| `uploaded`   | `string` |                :x: |                                                                                                             upload dates, not standard date format |
| `link`       | `string` | :white_check_mark: |                                                                                         contains either downloadable torrent url or magnet address |
| `site`       | `string` | :white_check_mark: | if magnet or direct link of .torrent cannot be extracted this property will contain specific page address to extract using `.torrent(site)` method |
| `resolution` | `string` | :white_check_mark: |                                                                                                             for movies and tv show. example: 1080p |

Specific for movies and tv show (Optional)

| Property     |   Type   |          Example |
| ------------ | :------: | ---------------: |
| `resolution` | `string` |          `1080p` |
| `source`     | `string` |         `webrip` |
| `codec`      | `string` |           `x264` |
| `group`      | `string` |            `PSA` |
| `season`     | `number` |              `4` |
| `episode`    | `number` |              `1` |
| `title`      | `string` | `Rick and Morty` |
| `sourceName` | `string` |          `1337x` |

```js
torrent(url);
```

| Parameters | Required |                                                                     Description |
| ---------- | :------: | ------------------------------------------------------------------------------: |
| url        |   Yes    | Using this method you can retrieve magnet or torrent hash from `.site` property |

Example:

```js
await torrentIndexer.torrent(torrent.site);
```

### Donations

If you want to show your appreciation, you can donate me on [ko-fi](https://ko-fi.com/Z8Z5KDA6) or [buy me a coffee](https://www.buymeacoffee.com/sayem). Thanks!

> Made with :heart: & :coffee: by Sayem
