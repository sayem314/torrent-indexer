# torrent-indexer [![Build Status](https://travis-ci.org/sayem314/torrent-indexer.svg?branch=master)](https://travis-ci.org/sayem314/torrent-indexer)

Finds the best torrents (Movies, Series and Other stuff) across multiple sources.

## Install:

```bash
$ npm i torrent-indexer
  or
$ yarn add torrent-indexer
```

## Usage:

```javascript
const torrentIndexer = require("torrent-indexer");

(async function() {
  let results = await torrentIndexer.search("rick and morty s04e04", "series");

  /*
  [
    {
      "resolution": "720p",
      "source": "hdtv",
      "codec": "x264",
      "season": 4,
      "episode": 4,
      "score": 23.213,
      "title": "Rick and Morty",
      "fileName": "Rick and Morty S04E04 Claw and Hoarder Special Ricktims Morty 720p HDTV x264-CRiMSON [eztv]",
      "size": "542.7 MB",
      "seeders": 587,
      "site": "https://1337x.to/torrent/4169905/Rick-and-Morty-S04E04-Claw-and-Hoarder-Special-Ricktims-Morty-720p-HDTV-x264-CRiMSON-eztv/",
      "uploaded": "Dec. 9th '19",
      "sourceName": "1337x"
    },
    ...
    ]
  */

  results = await torrentIndexer.search("x-men: dark phoenix 2019", "movie");

  /*
  [
    {
      "year": 2019,
      "resolution": "720p",
      "title": "X-Men: Dark Phoenix",
      "fileName": "X-Men: Dark Phoenix (2019) 720p",
      "score": 0.522,
      "size": "1023.6 MB",
      "link": "https://yts.lt/torrent/download/1E52BF4B0AF8D9200486F2EF5F8BFCE805DB4F2C",
      "seeders": 1455,
      "uploaded": "2019-08-29",
      "sourceName": "YTS"
    },
    ...
  ]
  */
})();
```
