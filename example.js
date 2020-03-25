/* eslint-disable */
const TorrentIndexer = require("./");
const torrentIndexer = new TorrentIndexer();

(async function() {
  // search tv series
  const series = await torrentIndexer.search("rick and morty s04e04", "series");
  console.dir([series[0]]);

  // search movies
  const movies = await torrentIndexer.search(
    "x-men: dark phoenix 2019",
    "movie"
  );
  console.dir([movies[0]]);

  // search anime
  const anime = await torrentIndexer.search("ride your wave", "anime");
  console.dir([anime[0]]);

  // search music or other thing
  const music = await torrentIndexer.search("lana del rey");
  console.dir([music[0]]);
})();
