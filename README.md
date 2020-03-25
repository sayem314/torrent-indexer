## torrent-indexer [![Build Status](https://travis-ci.org/sayem314/torrent-indexer.svg?branch=master)](https://travis-ci.org/sayem314/torrent-indexer)

Finds the best torrents (Movies, Series and Other stuff) across multiple sources.

### Install:

```bash
$ npm i torrent-indexer
  or
$ yarn add torrent-indexer
```

### Usage:

```js
const TorrentIndexer = require("torrent-indexer");
const torrentIndexer = new TorrentIndexer();
```

```js
// search tv series
const series = await torrentIndexer.search("rick and morty s04e04", "series");

[
  {
    resolution: '1080p',
    repack: true,
    source: 'webrip',
    codec: 'x264',
    group: 'CtrlHD[rartv]',
    season: 4,
    episode: 4,
    score: 24.205,
    title: 'Rick and Morty',
    fileName: 'Rick.and.Morty.S04E04.REPACK.1080p.AMZN.WEBRip.DDP5.1.x264-CtrlHD[rartv]',
    size: '538MB',
    link: 'magnet:?xt=urn:btih:...',
    seeders: 130,
    leechers: 9,
    uploaded: '2019-12-11 00:01:25 ',
    sourceName: 'Rarbg'
  },
  ...
]
```

```js
// search movies
const movies = await torrentIndexer.search("x-men: dark phoenix 2019", "movie");

[
  {
    year: 2019,
    resolution: '1080p',
    source: 'hdcam',
    codec: 'x264',
    group: 'NAHOM',
    title: 'X-Men Dark Phoenix',
    fileName: 'X-Men.Dark.Phoenix.2019.HDCAM 1080p Ita Eng x264-NAHOM',
    score: 0.348,
    size: '1.87 GB',
    link: 'magnet:?xt=urn:btih:...',
    seeders: 26,
    leechers: 1,
    uploaded: '9 months ago',
    sourceName: 'Sky Torrents'
  },
  ...
]
```

```js
// search anime
const anime = await torrentIndexer.search("ride your wave", "anime");

[
  {
    year: 2019,
    resolution: '720p',
    source: 'bluray',
    codec: 'x264',
    group: 'KangMus',
    score: 29.2,
    title: 'Ride Your Wave',
    fileName: 'Ride.Your.Wave.2019.720p.BluRay.x264.650MB-KangMus',
    size: '650.8 MB',
    seeders: 2,
    leechers: 0,
    site: 'https://....',
    uploaded: '1 month ago',
    sourceName: 'TorrentProject'
  },
  ...
]
```

```js
// search music or other stuff
const music = await torrentIndexer.search("lana del rey");

[
  {
    title: 'Lana Del Rey',
    fileName: 'Lana Del Rey',
    score: 0.444,
    size: '0 B',
    link: 'magnet:?xt=urn:btih:...',
    seeders: 20,
    leechers: 4,
    uploaded: '2 years ago',
    sourceName: 'Sky Torrents'
  },
  ...
]
```

### Donations

If you want to show your appreciation, you can donate me on [ko-fi](https://ko-fi.com/Z8Z5KDA6) or [buy me a coffee](https://www.buymeacoffee.com/sayem). Thanks!

> Made with :heart: & :coffee: by Sayem
